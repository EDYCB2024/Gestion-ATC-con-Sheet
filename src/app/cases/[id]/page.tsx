import React from "react";
import { getCaseById, getTimeline } from "@/lib/google-sheets";
import { 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  Timer, 
  MoreHorizontal, 
  Send, 
  Bold, 
  Paperclip, 
  Image as ImageIcon 
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CaseDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const atcCase = await getCaseById(id);
  
  if (!atcCase) {
    notFound();
  }

  const timeline = await getTimeline(atcCase.caso);

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
      {/* 1. Case Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
        <div className="flex items-start gap-4">
          <div className={`w-1 rounded-full h-16 ${atcCase.categoriaDeFalla === "Critical" ? "bg-error" : "bg-tertiary"}`}></div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-headline font-extrabold text-3xl tracking-tight text-on-surface uppercase">
                #{atcCase.caso}
              </span>
              <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                atcCase.categoriaDeFalla === "Critical" ? "bg-error-container text-on-error-container" : "bg-tertiary-container/30 text-on-tertiary-container"
              }`}>
                {atcCase.categoriaDeFalla || "Standard"}
              </span>
            </div>
            <h1 className="font-headline text-xl text-on-surface-variant font-medium">
              {atcCase.nombreComercio}
            </h1>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link href="/" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors pr-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold">Back</span>
          </Link>
          <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:opacity-90 transition-opacity">
            {atcCase.estatusCaso}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Main Communication Area */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Detailed Info Card */}
          <div className="bg-surface-container-low rounded-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">RIF</p>
              <p className="text-sm font-bold text-on-surface">{atcCase.rif}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">Serial</p>
              <p className="text-sm font-bold text-on-surface">{atcCase.serial}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">Operadora</p>
              <p className="text-sm font-bold text-on-surface">{atcCase.operadora}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">WiFi</p>
              <p className="text-sm font-bold text-on-surface">{atcCase.proveedorWifi}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">Contacto</p>
              <p className="text-sm font-bold text-on-surface">{atcCase.personaContacto}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">Teléfono</p>
              <p className="text-sm font-bold text-on-surface">{atcCase.telefonoContacto}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">Ubicación</p>
              <p className="text-sm font-bold text-on-surface">{atcCase.ciudad}, {atcCase.estado}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">Reportado por</p>
              <p className="text-sm font-bold text-on-surface">{atcCase.reportedBy}</p>
            </div>
          </div>

          {/* Falla Reportada */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm ring-1 ring-black/5">
            <h4 className="font-headline font-bold text-sm mb-4 uppercase tracking-widest opacity-40">Falla Reportada</h4>
            <p className="text-on-surface text-lg font-medium leading-relaxed">
              {atcCase.fallaReportadaCliente}
            </p>
          </div>

          {/* Observaciones */}
          {(atcCase.observaciones || atcCase.observacion2) && (
            <div className="space-y-4">
              <h4 className="font-headline font-bold text-sm uppercase tracking-widest opacity-40 pl-2">Observaciones Técnicas</h4>
              <div className="bg-surface-container-low/40 rounded-xl p-6 space-y-4 border-l-4 border-primary/20">
                {atcCase.observaciones && <p className="text-on-surface-variant italic">"{atcCase.observaciones}"</p>}
                {atcCase.observacion2 && <p className="text-on-surface-variant italic">"{atcCase.observacion2}"</p>}
                {atcCase.observacion3 && <p className="text-on-surface-variant italic">"{atcCase.observacion3}"</p>}
              </div>
            </div>
          )}

          {/* Conversation Timeline */}
          <div className="relative">
            {/* Thread Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-surface-variant opacity-30"></div>
            
            <div className="space-y-10">
              {timeline.map((event) => (
                <div key={event.id} className="relative pl-16 group">
                  <div className={`absolute left-4 top-2 w-4 h-4 rounded-full shadow-[0_0_0_6px_rgba(247,249,251,1)] z-10 ${
                    event.type === "Customer Message" ? "bg-tertiary" : "bg-primary"
                  }`}></div>
                  
                  <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm ring-1 ring-black/5 hover:ring-black/10 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`text-[10px] font-bold font-headline uppercase tracking-wider ${
                        event.type === "Customer Message" ? "text-tertiary" : "text-primary"
                      }`}>
                        {event.type} • {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <MoreHorizontal className="w-4 h-4 text-on-surface-variant/30 cursor-pointer" />
                    </div>
                    <p className="text-on-surface-variant leading-relaxed font-medium">
                      {event.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Area */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm ring-1 ring-black/5 mt-4">
            <div className="flex items-center gap-6 mb-6 pb-1 border-b border-surface-variant/20">
              <button className="text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-3 -mb-[2px]">
                Reply to Customer
              </button>
              <button className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-40 pb-3 -mb-[2px] hover:opacity-100 transition-opacity">
                Internal Note
              </button>
            </div>
            
            <div className="min-h-[160px] p-6 bg-surface-container-low/50 rounded-xl mb-6 text-on-surface-variant opacity-40 font-medium">
              Type your response here...
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button className="p-2.5 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"><Bold className="w-4 h-4" /></button>
                <button className="p-2.5 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"><Paperclip className="w-4 h-4" /></button>
                <button className="p-2.5 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"><ImageIcon className="w-4 h-4" /></button>
              </div>
              <button className="bg-primary text-on-primary px-8 py-3 rounded-xl font-headline font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-sm">
                Send Message <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
            <h4 className="font-headline font-bold text-sm mb-5 flex items-center justify-between uppercase tracking-widest opacity-40">
              Case Management
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </h4>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-40 block mb-2">Current Status</label>
                <div className="relative">
                  <select className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-primary/10">
                    <option>{atcCase.status}</option>
                    <option>Pending Verification</option>
                    <option>Escalated</option>
                    <option>On Hold</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-40 block mb-2">Assigned Agent</label>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary-container/40 flex items-center justify-center font-headline font-black text-primary text-sm shadow-inner">
                    AC
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface">Admin Central</p>
                    <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-tighter">Lead Resolver</p>
                  </div>
                  <button className="text-tertiary text-xs font-black hover:underline px-2">Reassign</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low/50 rounded-xl p-6">
            <h4 className="font-headline font-bold text-sm mb-4 uppercase tracking-[0.1em] opacity-40 text-on-surface">SLA Monitoring</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-on-surface-variant">First Response</span>
                <span className="text-tertiary font-bold flex items-center gap-1.5 bg-tertiary-container/20 px-3 py-1 rounded-full text-[10px] uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Met
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-on-surface-variant">Next Update In</span>
                <span className="text-error font-bold flex items-center gap-1.5 font-headline tabular-nums">
                  <Timer className="w-4 h-4" /> 14:02:45
                </span>
              </div>
              <div className="w-full bg-surface-variant/30 rounded-full h-1 overflow-hidden">
                <div className="bg-error h-full w-[85%] rounded-full shadow-[0_0_8px_rgba(159,64,61,0.4)]"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
            <h4 className="font-headline font-bold text-sm mb-4 uppercase tracking-widest opacity-40">Related Items</h4>
            <div className="space-y-4">
              <div className="group cursor-pointer">
                <p className="text-[10px] font-black text-primary uppercase group-hover:underline">#ATC-88402</p>
                <p className="text-sm font-medium text-on-surface-variant line-clamp-1 opacity-70">Sector 7 Power Outage Reporting</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-[10px] font-black text-primary uppercase group-hover:underline">#ATC-87991</p>
                <p className="text-sm font-medium text-on-surface-variant line-clamp-1 opacity-70">Automated Handover Delay</p>
              </div>
            </div>
            <button className="w-full mt-8 pt-4 border-t border-surface-variant/20 text-center text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40 hover:opacity-100 transition-all">
              View Node History
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
