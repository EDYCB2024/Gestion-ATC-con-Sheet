'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Copy, Check, ArrowLeft, List, ShieldCheck, ShieldX, Hash, Download, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import * as XLSX from 'xlsx'

export default function WarrantyPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [slug, setSlug] = useState('bd_clientes')
  const [searchQuery, setSearchQuery] = useState('')
  const [allies, setAllies] = useState<any[]>([])

  useEffect(() => {
    async function fetchAllies() {
      const { data: alliesData } = await supabase.from('allies_config').select('name, table_name')
      if (alliesData) setAllies(alliesData)
    }
    fetchAllies()
  }, [])

  const fetchData = async () => {
    if (!slug) return
    try {
      setLoading(true)
      let query = supabase.from(slug).select('*').limit(100)
      
      if (searchQuery) {
        query = query.or(`serial.ilike.%${searchQuery}%,razon_social.ilike.%${searchQuery}%,razn_social.ilike.%${searchQuery}%`)
      }

      const { data: tableData, error } = await query
      if (error) throw error
      setData(tableData || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [slug])

  const copySerials = () => {
    const serials = data.map(row => row.serial || row.serial_de_remplazo).filter(Boolean)
    navigator.clipboard.writeText(serials.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="px-10 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight uppercase">Control de Garantías</h1>
            </div>
            <p className="text-body-md text-on-surface-variant/70 font-medium">Consulta masiva de seriales y validación de estatus técnico.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
             <button
              onClick={copySerials}
              disabled={data.length === 0}
              className="flex-1 sm:flex-none flex items-center gap-3 bg-white border border-outline-variant/30 text-on-surface px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all hover:bg-surface-container-low active:scale-95 disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado' : 'Copiar Seriales'}
            </button>
          </div>
        </div>
      </header>

      <main className="px-10 pb-10 space-y-8">
        <div className="bg-white/80 backdrop-blur-md rounded-[40px] border border-outline-variant/30 overflow-hidden shadow-sm">
           <div className="px-8 py-6 border-b border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
                <div className="flex items-center gap-2 bg-surface-container-low px-4 py-3 rounded-2xl border border-outline-variant/20">
                  <Filter className="w-4 h-4 text-primary" />
                  <select 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="bg-transparent text-[11px] font-black uppercase tracking-widest text-on-surface focus:outline-none cursor-pointer"
                  >
                    <option value="bd_clientes">Base Global</option>
                    {allies.map(a => (
                      <option key={a.table_name} value={a.table_name}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div className="relative w-full sm:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Buscar serial..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                    className="w-full pl-12 pr-6 py-3 bg-surface-container-low border border-outline-variant/20 rounded-2xl text-[13px] font-bold text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="px-4 py-2 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
                    {data.length} Registros
                 </span>
              </div>
           </div>

           <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary/[0.02] border-b border-outline-variant/10">
                  <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em]">Serial / Equipo</th>
                  <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em]">Propietario / Comercio</th>
                  <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em]">Garantía</th>
                  <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em]">Estatus</th>
                  <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <Loader2 className="w-12 h-12 text-primary/20 animate-spin mx-auto mb-4" />
                      <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Consultando base de datos...</p>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-on-surface-variant/20" />
                      </div>
                      <p className="text-[11px] font-black text-on-surface-variant/40 uppercase tracking-widest">No se encontraron resultados para esta búsqueda</p>
                    </td>
                  </tr>
                ) : data.map((row, i) => (
                  <tr key={i} className="hover:bg-primary/[0.04] transition-all group border-l-4 border-l-transparent hover:border-l-primary">
                    <td className="px-8 py-5">
                      <p className="font-mono font-bold text-[13px] text-primary">{row.serial || row.serial_de_remplazo}</p>
                      <p className="text-[10px] font-black uppercase text-on-surface-variant/40">{row.modelo || 'S/N'}</p>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-[13px] font-bold text-on-surface truncate max-w-[300px]">{row.razon_social || row.razn_social || '-'}</p>
                       <p className="text-[10px] font-black uppercase text-on-surface-variant/40">{row.rif || 'Sin RIF'}</p>
                    </td>
                    <td className="px-8 py-5">
                      {row.garantia?.toLowerCase() === 'si' ? (
                        <div className="flex items-center gap-2 text-green-600">
                           <ShieldCheck className="w-4 h-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Vigente</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-on-surface-variant/30">
                           <ShieldX className="w-4 h-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Expirada</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                       <span className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                          row.estatus?.toLowerCase().includes('operativo') ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"
                       )}>
                          {row.estatus || 'EN REVISION'}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2 hover:bg-primary/10 rounded-xl text-on-surface-variant/40 hover:text-primary transition-all">
                          <Download className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-[40px] border border-outline-variant/30 overflow-hidden shadow-sm">
           <div className="px-8 py-4 bg-primary/[0.02] border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 flex items-center gap-2">
                 <Hash className="w-4 h-4" />
                 Listado de Seriales en Texto Plano
              </h3>
              <button onClick={copySerials} className="text-[10px] font-black uppercase text-primary hover:underline transition-all">
                 {copied ? '¡Listo!' : 'Copiar todo'}
              </button>
           </div>
           <div className="p-8">
              <textarea 
                readOnly
                value={data.map(row => row.serial || row.serial_de_remplazo).filter(Boolean).join('\n')}
                placeholder="Los seriales filtrados aparecerán aquí..."
                className="w-full h-40 bg-surface-container-low/50 border border-outline-variant/20 rounded-3xl p-6 font-mono text-xs text-on-surface-variant/70 focus:outline-none resize-none"
              />
           </div>
        </div>
      </main>
    </div>
  )
}
