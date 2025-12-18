
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  LayoutDashboard, Users, Calendar, MapPin, 
  Search, CheckCircle2, AlertCircle, 
  LogOut, Activity, ShieldAlert, Tent, 
  Database, Zap, ListFilter, ArrowRightLeft,
  Menu
} from 'lucide-react';
import { RAW_DATA } from './data';
import { Employee } from './types';

type ViewType = 'dashboard' | 'personnel' | 'calendar' | 'map';

const StatCard = ({ title, value, icon: Icon, color, active, onClick, subtitle }: { 
  title: string, value: number, icon: any, color: string, active: boolean, onClick: () => void, subtitle?: string
}) => (
  <div 
    onClick={onClick}
    className={`glass-effect p-5 rounded-2xl flex items-center justify-between border cursor-pointer transition-all duration-300 ${
      active ? 'border-cyan-500/50 bg-cyan-500/10 scale-[1.03] shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-white/5 hover:border-white/20'
    }`}
  >
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</span>
      <span className={`text-3xl font-futuristic font-black transition-colors ${active ? 'text-cyan-400' : 'text-white'}`}>{value}</span>
      {subtitle && <span className="text-[9px] text-slate-500 font-bold mt-1 uppercase">{subtitle}</span>}
    </div>
    <div className={`p-3 rounded-xl bg-slate-900/80 border border-white/5 transition-all ${active ? 'text-cyan-400 scale-110 shadow-lg' : 'text-slate-500'} ${color}`}>
      <Icon size={22} />
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const normalizeLoc = (loc: string) => loc.charAt(0).toUpperCase() + loc.slice(1).toLowerCase().trim();

  // MOTOR DE DATOS: Lógica de exclusión estricta para garantizar (74, 127, 3)
  const processedData = useMemo(() => {
    return RAW_DATA.map(emp => {
      const f = emp.fechaDescanso.toLowerCase();
      let status = 'Other';
      
      const hasDec26 = f.includes('26 de diciembre');
      const hasJan02 = f.includes('2 de enero') || f.includes('02 de enero');

      // 1. Prioridad: Ambos días (3 registros)
      if (hasDec26 && hasJan02) {
        status = 'Both';
      } 
      // 2. Turnos individuales (Excluyentes)
      else if (hasDec26) {
        status = '26-Dec'; // 74 registros
      } else if (hasJan02) {
        status = '02-Jan'; // 127 registros
      } 
      // 3. Estados operativos
      else if (f.includes('vacaciones')) {
        status = 'Vacations';
      } else if (f.includes('no sale')) {
        status = 'Working';
      } else if (f.includes('incapacitado')) {
        status = 'Sick';
      } else if (f.includes('sin confirmar')) {
        status = 'Unconfirmed';
      }
      
      return { ...emp, status };
    });
  }, []);

  const locations = useMemo(() => ['All', ...Array.from(new Set(processedData.map(d => normalizeLoc(d.ubicacion))))], [processedData]);

  const filteredData = useMemo(() => {
    return processedData.filter(emp => {
      const matchesSearch = emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           emp.id.includes(searchTerm) || 
                           emp.cargo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === 'All' || normalizeLoc(emp.ubicacion) === locationFilter;
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [searchTerm, locationFilter, statusFilter, processedData]);

  const stats = useMemo(() => {
    return {
      total: processedData.length,
      working: processedData.filter(d => d.status === 'Working').length,
      vacations: processedData.filter(d => d.status === 'Vacations').length,
      unconfirmed: processedData.filter(d => d.status === 'Unconfirmed').length,
      sick: processedData.filter(d => d.status === 'Sick').length,
      both: processedData.filter(d => d.status === 'Both').length,
      dec26: processedData.filter(d => d.status === '26-Dec').length,
      jan02: processedData.filter(d => d.status === '02-Jan').length,
    };
  }, [processedData]);

  const locationStats = useMemo(() => {
    const counts: Record<string, number> = {};
    processedData.forEach(d => {
      const loc = normalizeLoc(d.ubicacion);
      counts[loc] = (counts[loc] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [processedData]);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass-effect border-r border-white/5 transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-futuristic text-lg font-black text-white leading-none tracking-tighter">NEXUS</h1>
              <span className="text-[8px] text-cyan-500 font-bold tracking-[0.3em] uppercase">Control Panel</span>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { id: 'dashboard', label: 'Visión General', icon: LayoutDashboard },
              { id: 'personnel', label: 'Personal', icon: Users },
              { id: 'calendar', label: 'Cronograma', icon: Calendar },
              { id: 'map', label: 'Frentes', icon: MapPin },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => { setActiveView(item.id as ViewType); setSidebarOpen(false); }}
                className={`flex items-center gap-4 p-4 w-full rounded-2xl transition-all duration-300 ${
                  activeView === item.id 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon size={18} />
                <span className="font-bold text-[10px] uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </nav>

          <button className="flex items-center gap-4 p-4 mt-auto text-slate-600 hover:text-red-400 transition-colors font-black text-[10px] tracking-[0.2em] uppercase">
            <LogOut size={18} />
            <span>Salir</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 space-y-8 overflow-y-auto h-screen relative">
        {/* HUD MONITOR SUPERIOR */}
        <header className="sticky top-0 z-40">
          <div className="glass-effect p-6 rounded-[2rem] border border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-cyan-500 tracking-[0.4em] uppercase mb-1">Index Monitor</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-futuristic font-black text-white tracking-tighter">
                    {filteredData.length}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-slate-500 font-bold text-lg leading-none">/ {processedData.length}</span>
                    <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest mt-1">Colaboradores</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden xl:flex items-center gap-4 px-8 border-l border-white/10">
                <div className="p-3 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
                  <ListFilter size={20} className="text-cyan-400" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase block tracking-widest mb-1">Capa Activa</span>
                  <span className="text-xs font-black text-white uppercase tracking-tight">
                    {statusFilter === 'All' ? 'Consolidado General' : statusFilter === 'Both' ? 'Doble Descanso' : `Receso: ${statusFilter}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar nombre o ID..."
                  className="bg-slate-950/80 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-xs font-bold focus:outline-none focus:border-cyan-500/50 w-full md:w-80 transition-all shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('All'); setLocationFilter('All'); }}
                className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 text-slate-400 transition-all hover:text-cyan-400"
              >
                <ArrowRightLeft size={20} />
              </button>
              <button className="lg:hidden p-4 bg-cyan-500/10 rounded-2xl text-cyan-400" onClick={() => setSidebarOpen(true)}>
                <Menu size={20} />
              </button>
            </div>
          </div>
        </header>

        {activeView === 'dashboard' && (
          <>
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-futuristic font-black text-white tracking-tighter uppercase">Visión <span className="text-cyan-500">General</span></h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Distribución de recesos compensatorios - Periodo 2025/2026</p>
            </div>

            {/* Stats Grid - EXACTOS: 74, 127, 3 */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard 
                title="RECESO 26-DIC" value={stats.dec26} icon={Calendar} color="text-purple-400" 
                active={statusFilter === '26-Dec'} onClick={() => setStatusFilter('26-Dec')} 
                subtitle="Excluye Mixtos"
              />
              <StatCard 
                title="RECESO 02-ENE" value={stats.jan02} icon={Calendar} color="text-blue-400" 
                active={statusFilter === '02-Jan'} onClick={() => setStatusFilter('02-Jan')} 
                subtitle="Excluye Mixtos"
              />
              <StatCard 
                title="AMBOS DÍAS" value={stats.both} icon={Zap} color="text-indigo-400" 
                active={statusFilter === 'Both'} onClick={() => setStatusFilter('Both')} 
                subtitle="Descanso Doble"
              />
              <StatCard 
                title="SIN SALIDA" value={stats.working} icon={CheckCircle2} color="text-emerald-400" 
                active={statusFilter === 'Working'} onClick={() => setStatusFilter('Working')} 
                subtitle="Operativo"
              />
              <StatCard title="VACACIONES" value={stats.vacations} icon={Tent} color="text-orange-400" active={statusFilter === 'Vacations'} onClick={() => setStatusFilter('Vacations')} />
              <StatCard title="PENDIENTES" value={stats.unconfirmed} icon={AlertCircle} color="text-slate-400" active={statusFilter === 'Unconfirmed'} onClick={() => setStatusFilter('Unconfirmed')} />
              <StatCard title="INCAPACITADOS" value={stats.sick} icon={ShieldAlert} color="text-red-400" active={statusFilter === 'Sick'} onClick={() => setStatusFilter('Sick')} />
              <StatCard title="TOTAL GENERAL" value={stats.total} icon={Database} color="text-cyan-400" active={statusFilter === 'All'} onClick={() => setStatusFilter('All')} />
            </section>

            {/* Tabla Integrada */}
            <section className="glass-effect rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl transition-all">
              <div className="p-8 border-b border-white/5 flex flex-wrap items-center justify-between gap-6 bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-cyan-500 rounded-full"></div>
                  <h3 className="text-xl font-futuristic font-black tracking-tight uppercase text-white">Detalle de Personal</h3>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Filtrar por Frente:</span>
                    <select 
                      className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase focus:outline-none focus:border-cyan-500 cursor-pointer text-slate-300"
                      value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
                    >
                      {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                      <th className="px-8 py-6">Identificación</th>
                      <th className="px-8 py-6">Nombre Completo</th>
                      <th className="px-8 py-6">Cargo / Posición</th>
                      <th className="px-8 py-6">Ubicación</th>
                      <th className="px-8 py-6 text-center">Programación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredData.length > 0 ? filteredData.map((emp) => (
                      <tr key={emp.id} className="hover:bg-cyan-500/[0.03] transition-all group">
                        <td className="px-8 py-5 font-mono text-[11px] text-slate-500 group-hover:text-cyan-400">#{emp.id}</td>
                        <td className="px-8 py-5">
                          <span className="font-bold text-white uppercase text-xs group-hover:translate-x-1 transition-transform inline-block">{emp.nombre}</span>
                        </td>
                        <td className="px-8 py-5 text-[10px] text-slate-400 uppercase font-bold">{emp.cargo}</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-slate-300 text-[11px] font-bold">
                            <MapPin size={14} className="text-cyan-500/40" />
                            {normalizeLoc(emp.ubicacion)}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border tracking-widest ${
                            emp.status === 'Working' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            emp.status === 'Both' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                            emp.status === '26-Dec' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            emp.status === '02-Jan' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-slate-500/10 text-slate-500 border-slate-500/20'
                          }`}>
                            {emp.fechaDescanso}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-32 text-center text-slate-500 font-futuristic uppercase tracking-[0.3em]">
                            Búsqueda sin resultados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* Otras vistas simplificadas para enfoque en Visión General */}
        {activeView === 'calendar' && (
          <div className="p-20 glass-effect rounded-[3rem] border border-white/5 text-center">
            <Calendar size={100} className="mx-auto mb-8 text-cyan-500/40" />
            <h3 className="text-4xl font-futuristic font-black text-white mb-6 uppercase">Cronograma Operativo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="text-4xl font-futuristic text-purple-400 mb-2">{stats.dec26}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">26 de Diciembre</div>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="text-4xl font-futuristic text-blue-400 mb-2">{stats.jan02}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">02 de Enero</div>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="text-4xl font-futuristic text-indigo-400 mb-2">{stats.both}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ambas Fechas</div>
                </div>
            </div>
          </div>
        )}

        {activeView === 'map' && (
          <div className="p-12 glass-effect rounded-[3rem] border border-white/5">
             <div className="flex items-center gap-6 mb-12">
                <MapPin className="text-cyan-500" size={40} />
                <h3 className="text-3xl font-futuristic font-black text-white uppercase">Carga por Frentes</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locationStats.map((loc, i) => (
                    <div key={i} className="p-6 bg-slate-950/50 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-cyan-500/30 transition-all">
                        <span className="text-xs font-black uppercase tracking-tighter text-slate-300 group-hover:text-white transition-colors">{loc.name}</span>
                        <span className="text-2xl font-futuristic font-black text-cyan-500">{loc.value}</span>
                    </div>
                ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
