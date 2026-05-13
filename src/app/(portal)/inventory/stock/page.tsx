'use client'

import { useEffect, useState } from 'react'
import { Boxes, TrendingUp, ArrowUpRight, Download, MoreVertical, Plus, X, Loader2, RefreshCw, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { supabase } from '@/lib/supabase'

// Cache outside the component to persist inventory between remounts
let cachedInventory: any[] | null = null;

export default function StockPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [data, setData] = useState<any[]>(cachedInventory || [])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(!cachedInventory)
  const [saving, setSaving] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null }>({
    key: 'codigo',
    direction: 'asc'
  })

  // Form State
  const [formData, setFormData] = useState({
    codigo: '',
    modelo: '',
    descripcion: '',
    stock: ''
  })

  const fetchInventory = async (force: boolean = false) => {
    if (!force && cachedInventory) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true)
      const { data: inventoryData, error: dbError } = await supabase
        .from('inventory')
        .select('*')
        .order('codigo', { ascending: true })

      if (dbError) throw dbError
      
      cachedInventory = inventoryData || [];
      setData(cachedInventory)
    } catch (err: any) {
      console.error('Error fetching inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id)
    setFormData({
      codigo: item.codigo,
      modelo: item.modelo,
      descripcion: item.descripcion,
      stock: item.stock.toString()
    })
    setIsModalOpen(true)
  }

  const handleSaveRepuesto = async () => {
    if (!formData.codigo) {
      alert('El código es obligatorio')
      return
    }

    try {
      setSaving(true)
      const payload = {
        codigo: formData.codigo,
        modelo: formData.modelo,
        descripcion: formData.descripcion,
        stock: parseInt(formData.stock) || 0
      }

      let error = null
      if (editingId) {
        const { error: updateError } = await supabase
          .from('inventory')
          .update(payload)
          .eq('id', editingId)
        error = updateError
      } else {
        const { error: saveError } = await supabase
          .from('inventory')
          .insert([payload])
        error = saveError
      }

      if (error) throw error

      setFormData({ codigo: '', modelo: '', descripcion: '', stock: '' })
      setEditingId(null)
      setIsModalOpen(false)
      fetchInventory(true)
    } catch (err: any) {
      alert('Error al guardar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const filteredData = data.filter(item => 
    item.codigo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.modelo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0
    
    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]

    if (sortConfig.key === 'stock') {
      aValue = Number(aValue)
      bValue = Number(bValue)
    } else {
      aValue = String(aValue || '').toLowerCase()
      bValue = String(bValue || '').toLowerCase()
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="px-10 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Boxes className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight uppercase">Stock de Repuestos</h1>
            </div>
            <p className="text-body-md text-on-surface-variant/70 font-medium">Control detallado de piezas y componentes técnicos en almacén.</p>
          </div>
          <button className="flex items-center gap-3 bg-primary text-on-primary px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all w-full sm:w-auto justify-center">
            <Download className="w-4 h-4" />
            Exportar Inventario
          </button>
        </div>
      </header>

      <main className="px-10 pb-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {data.filter(i => i.stock < 100).slice(0, 3).map((item, idx) => (
             <div key={idx} className="bg-red-50/50 backdrop-blur-md p-6 rounded-[32px] border border-red-100 flex items-center justify-between group cursor-help">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500/60">Stock Crítico</p>
                    <h4 className="text-sm font-black text-on-surface uppercase">{item.modelo}</h4>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-headline font-black text-red-600">{item.stock}</p>
                  <p className="text-[9px] font-black uppercase text-red-400">Unidades</p>
                </div>
             </div>
           ))}
           {data.filter(i => i.stock < 100).length === 0 && (
             <div className="col-span-3 bg-green-50/30 p-6 rounded-[32px] border border-green-100 border-dashed text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600">Todos los niveles de stock se encuentran en rangos saludables</p>
             </div>
           )}
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-[40px] border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
              <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Buscar por código o modelo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-surface-container-low border border-outline-variant/20 rounded-2xl text-[13px] font-bold text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all"
                />
              </div>
              <button
                onClick={() => fetchInventory(true)}
                className="w-full sm:w-auto px-6 py-3 bg-white border border-outline-variant/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 justify-center hover:bg-surface-container-low transition-all shadow-sm"
              >
                <RefreshCw className={cn("w-4 h-4 text-primary", loading && "animate-spin")} />
                Refrescar
              </button>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3 bg-on-surface text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 justify-center hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-on-surface/10"
            >
              <Plus className="w-4 h-4" />
              Nuevo Repuesto
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary/[0.02] border-b border-outline-variant/10">
                  <th onClick={() => handleSort('codigo')} className="px-8 py-5 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] cursor-pointer hover:text-primary transition-colors">
                    <div className="flex items-center gap-2">
                      Código
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('modelo')} className="px-8 py-5 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] cursor-pointer hover:text-primary transition-colors">
                     <div className="flex items-center gap-2">
                      Modelo
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em]">Descripción</th>
                  <th onClick={() => handleSort('stock')} className="px-8 py-5 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] cursor-pointer hover:text-primary transition-colors text-right">
                     <div className="flex items-center justify-end gap-2">
                      Existencia
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <Loader2 className="w-12 h-12 text-primary/20 animate-spin mx-auto mb-4" />
                      <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Sincronizando inventario...</p>
                    </td>
                  </tr>
                ) : sortedData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-primary/[0.04] transition-all group border-l-4 border-l-transparent hover:border-l-primary">
                    <td className="px-8 py-5 font-mono font-bold text-[13px] text-primary">{item.codigo}</td>
                    <td className="px-8 py-5">
                       <span className="px-3 py-1 bg-surface-container-low rounded-lg text-[11px] font-black uppercase text-on-surface-variant">{item.modelo}</span>
                    </td>
                    <td className="px-8 py-5 text-[13px] font-medium text-on-surface-variant/80">{item.descripcion}</td>
                    <td className="px-8 py-5 text-right">
                      <span className={cn(
                        "text-lg font-headline font-black",
                        item.stock < 100 ? "text-red-500" : "text-on-surface"
                      )}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 hover:bg-primary/10 rounded-xl text-on-surface-variant/40 hover:text-primary transition-all"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white/90 backdrop-blur-2xl w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border border-outline-variant/30 relative z-10 animate-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-outline-variant/30 flex items-center justify-between">
               <h2 className="text-xl font-headline font-black text-on-surface uppercase tracking-tighter">{editingId ? 'Editar Repuesto' : 'Nuevo Repuesto'}</h2>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all"><X className="w-5 h-5 opacity-40" /></button>
            </div>
            <div className="p-10 space-y-6">
               {[ 
                 { id: 'codigo', label: 'Código Interno', placeholder: 'Ej: POS-BAT-950' },
                 { id: 'modelo', label: 'Modelo Compatible', placeholder: 'Ej: N950 / N910' },
                 { id: 'descripcion', label: 'Descripción de la Pieza', placeholder: 'Ej: Batería de Litio 3.7V' },
                 { id: 'stock', label: 'Cantidad en Almacén', placeholder: '0', type: 'number' },
               ].map(field => (
                 <div key={field.id} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 px-1">{field.label}</label>
                    <input 
                      type={field.type || 'text'}
                      value={(formData as any)[field.id]}
                      onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                      placeholder={field.placeholder}
                      className="w-full bg-surface-container-low/50 border border-outline-variant/30 rounded-2xl px-5 py-4 text-[13px] font-bold text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                 </div>
               ))}
            </div>
            <div className="p-10 bg-primary/[0.02] border-t border-outline-variant/30 flex gap-4">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:bg-surface-container-low rounded-2xl transition-all">Descartar</button>
               <button 
                onClick={handleSaveRepuesto}
                disabled={saving}
                className="flex-[2] py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
               >
                 {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                 {editingId ? 'Actualizar' : 'Guardar Repuesto'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
