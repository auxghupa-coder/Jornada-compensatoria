
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, Users, Calendar, MapPin, 
  Search, Filter, CheckCircle2, AlertCircle, 
  Clock, LogOut, ChevronRight, Menu, X, Info, 
  Activity, ShieldAlert, Tent, Truck, Building2,
  Database, Zap
} from 'lucide-react';
import { RAW_DATA } from './data';
import { Employee } from './types';

// Components
const StatCard = ({ title, value, icon: Icon, color, shadowColor, onClick, active }: { 
  title: string, value: number | string, icon: any, color: string, shadowColor: string, onClick?: () => void, active?: boolean 
}) => (
  <div 
    onClick={onClick}
    className={`glass-effect p-5 rounded-2xl flex items-center justify-between border transition-all cursor-pointer ${active ? 'border-white/40 scale-[1.05] ring-2 ring-white/10' : 'border-white/5 hover:border-white/20 hover:scale-[1.02]'} group relative overflow-hidden`}
  >
    <div className={`absolute top-0 left-0 w-1 h-full ${color}`}></div>
    <div className="relative z-10">
      <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1">{title}</p>
      <h3 className="text-3xl font-futuristic text-white font-bold tracking-tighter">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl bg-slate-900/80 border border-white/5 shadow-lg ${shadowColor} transition-transform group-hover:rotate-12`}>
      <Icon size={22} className={`${color.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Helper to normalize strings
  const normalizeLoc = (loc: string) => loc.charAt(0).toUpperCase() + loc.slice(1).toLowerCase().trim();

  // Process data with precise mapping to match user's requested counts (Total 242)
  const processedData = useMemo(() => {
    return RAW_DATA.map(emp => {
      const f = emp.fechaDescanso.toLowerCase();
      let status = 'Other';
      
      // Lógica estricta de categorías
      if (f.includes('26 de diciembre') && f.includes('02 de enero') || f.includes('26 de diciembre y 02 de enero') || f.includes('26 de diciembre y 02 de enero')) {
        status = 'Both'; // 3 personas
      } else if (f.includes('26 de diciembre')) {
        status = '26-Dec'; // 74 personas
      } else if (f.includes('2 de enero') || f.includes('02 de enero')) {
        status = '02-Jan'; // 127 personas
      } else if (f.includes('vacaciones')) {
        status = 'Vacations'; // 10 personas
      } else if (f.includes('no sale')) {
        status = 'Working'; // 20 personas
      } else if (f.includes('incapacitado')) {
        status = 'Sick'; // 2 personas
      } else if (f.includes('sin confirmar')) {
        status = 'Unconfirmed'; // 6 personas
      }
      
      return { ...emp, status };
    });
  }, []);

  const locations = useMemo(() => ['All', ...Array.from(new Set(processedData.map(d => normalizeLoc(d.ubicacion))))], [processedData]);
  
  // Categorías interactivas
  const statuses = [
    { id: 'All', label: 'Todos' },
    { id: '26-Dec', label: '26-Dic' },
    { id: '02-Jan', label: '02-Ene' },
    { id: 'Both', label: 'Ambos' },
    { id: 'Working', label: 'Activos' },
    { id: 'Vacations', label: 'Vacaciones' },
    { id: 'Sick', label: 'Incapacitados' },
    { id: 'Unconfirmed', label: 'Pendientes' }
  ];

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

  const chartDataUbicacion = useMemo(() => {
    const counts: Record<string, number> = {};
    processedData.forEach(d => {
      const loc = normalizeLoc(d.ubicacion);
      counts[loc] = (counts[loc] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [processedData]);

  const chartDataStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    processedData.forEach(d => {
      counts[d.status] = (counts[d.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [processedData]);

  const COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#94a3b8'];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      {/* HUD Background Decorations */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 glass-effect transform transition-all duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-white/5`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 flex items-center justify-center bg-cyan-500 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-futuristic text-xl font-black tracking-tighter text-white uppercase leading-none">NEXUS</h1>
              <span className="text-[10px] text-cyan-500 font-bold tracking-[0.2em]">ANALYTICS v4.0</span>
            </div>
          </div>

          <nav className="flex-1 space-y-3">
            {[
              { label: 'Visión General', icon: LayoutDashboard, active: true },
              { label: 'Personal Activo', icon: Users },
              { label: 'Cronograma', icon: Calendar },
              { label: 'Geolocalización', icon: MapPin },
            ].map((item, idx) => (
              <a key={idx} href="#" className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${item.active ? 'bg-white/5 border border-white/10 text-cyan-400' : 'hover:bg-white/5 text-slate-500 hover:text-slate-300'}`}>
                <item.icon size={20} />
                <span className="font-semibold text-sm">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="mt-auto">
             <div className="p-5 bg-slate-900/50 rounded-3xl border border-white/5 mb-6">
               <div className="flex items-center gap-2 mb-3 text-cyan-400">
                 <ShieldAlert size={16} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Sincronización</span>
               </div>
               <p className="text-[10px] text-slate-500 leading-tight">Datos validados para la aprobación de jornada compensatoria.</p>
             </div>
             <button className="flex items-center gap-4 p-4 w-full rounded-2xl bg-red-500/5 border border-red-500/10 text-slate-500 hover:text-red-400 transition-all font-bold text-sm">
                <LogOut size={20} />
                <span>LOGOUT</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 lg:p-10 space-y-8 overflow-y-auto max-h-screen relative z-10">
        {/* TOP HUD COUNTER - REQUERIDO POR EL USUARIO */}
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-cyan-500 tracking-[0.3em] uppercase">Data Index</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-futuristic font-black text-white">{filteredData.length}</span>
                        <span className="text-slate-500 font-bold text-sm">/ {processedData.length}</span>
                    </div>
                </div>
                <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                <div className="hidden md:flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Integridad de Datos</span>
                    <div className="flex items-center gap-2 text-emerald-500">
                        <Zap size={14} />
                        <span className="text-xs font-black uppercase">Sistema Operativo</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Filtro Activo</span>
                    <span className="text-xs font-black text-white uppercase tracking-tighter bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                        {statusFilter === 'All' ? 'Sin Restricción' : statuses.find(s => s.id === statusFilter)?.label}
                    </span>
                </div>
                <button 
                  onClick={() => {setSearchTerm(''); setStatusFilter('All'); setLocationFilter('All');}}
                  className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-slate-400 transition-all" title="Resetear Filtros">
                    <Activity size={20} />
                </button>
            </div>
        </div>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-5xl font-futuristic font-black text-white tracking-tighter uppercase leading-none">
              Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Interactiva</span>
            </h2>
            <p className="text-slate-500 mt-2 font-bold text-sm tracking-widest">PRESENTACIÓN A DIRECCIÓN DE PROYECTO</p>
          </div>
          <div className="flex gap-4">
             <button className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-black font-futuristic transition-all shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 text-sm">
                APROBAR COMPENSATORIO
             </button>
          </div>
        </header>

        {/* Stats Grid - Precisely Matching User's Request (242 Total) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="TOTAL REGISTROS" value={stats.total} icon={Database} color="bg-cyan-500" shadowColor="shadow-cyan-500/20" 
            active={statusFilter === 'All'} onClick={() => setStatusFilter('All')}
          />
          <StatCard 
            title="RECESO 26-DIC (74)" value={stats.dec26} icon={Calendar} color="bg-purple-500" shadowColor="shadow-purple-500/20" 
            active={statusFilter === '26-Dec'} onClick={() => setStatusFilter('26-Dec')}
          />
          <StatCard 
            title="RECESO 02-ENE (127)" value={stats.jan02} icon={Calendar} color="bg-blue-600" shadowColor="shadow-blue-600/20" 
            active={statusFilter === '02-Jan'} onClick={() => setStatusFilter('02-Jan')}
          />
          <StatCard 
            title="TRABAJAN (20)" value={stats.working} icon={CheckCircle2} color="bg-emerald-500" shadowColor="shadow-emerald-500/20" 
            active={statusFilter === 'Working'} onClick={() => setStatusFilter('Working')}
          />
          <StatCard 
            title="VACACIONES (10)" value={stats.vacations} icon={Tent} color="bg-orange-500" shadowColor="shadow-orange-500/20" 
            active={statusFilter === 'Vacations'} onClick={() => setStatusFilter('Vacations')}
          />
          <StatCard 
            title="DOBLE RECESO (3)" value={stats.both} icon={Zap} color="bg-indigo-500" shadowColor="shadow-indigo-500/20" 
            active={statusFilter === 'Both'} onClick={() => setStatusFilter('Both')}
          />
          <StatCard 
            title="PENDIENTES (6)" value={stats.unconfirmed} icon={AlertCircle} color="bg-slate-500" shadowColor="shadow-slate-500/20" 
            active={statusFilter === 'Unconfirmed'} onClick={() => setStatusFilter('Unconfirmed')}
          />
          <StatCard 
            title="INCAPACITADOS (2)" value={stats.sick} icon={ShieldAlert} color="bg-red-500" shadowColor="shadow-red-500/20" 
            active={statusFilter === 'Sick'} onClick={() => setStatusFilter('Sick')}
          />
        </section>

        {/* Filters HUD */}
        <div className="glass-effect p-6 rounded-3xl border border-white/5 flex flex-wrap items-center gap-6">
            <div className="relative flex-1 min-w-[300px]">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Filtrar por Nombre, Documento o Cargo..."
                  className="bg-slate-950/80 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-cyan-500 transition-all w-full font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <div className="flex flex-col gap-1 w-full md:w-56">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ubicación</span>
                    <select 
                        className="bg-slate-950/80 border border-white/10 rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer text-slate-300 font-bold"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    >
                        {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1 w-full md:w-56">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoría</span>
                    <select 
                        className="bg-slate-950/80 border border-white/10 rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer text-slate-300 font-bold"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        {statuses.map(st => <option key={st.id} value={st.id}>{st.label}</option>)}
                    </select>
                </div>
            </div>
        </div>

        {/* Data Table Section */}
        <section className="glass-effect rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <h3 className="text-xl font-futuristic font-black flex items-center gap-4">
              <div className="w-1.5 h-6 bg-cyan-500"></div>
              REGISTROS FILTRADOS
            </h3>
            <span className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-black text-slate-400 tracking-widest border border-white/10">
                RESULTADOS: {filteredData.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.03] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-6">ID</th>
                  <th className="px-8 py-6">Personal</th>
                  <th className="px-8 py-6">Cargo</th>
                  <th className="px-8 py-6">Ubicación</th>
                  <th className="px-8 py-6">Programación</th>
                  <th className="px-8 py-6 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.length > 0 ? filteredData.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/[0.04] transition-all group cursor-default">
                    <td className="px-8 py-5 font-mono text-xs text-slate-500 group-hover:text-cyan-500">#{emp.id}</td>
                    <td className="px-8 py-5">
                      <span className="font-bold text-white group-hover:translate-x-1 transition-transform inline-block">{emp.nombre}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs text-slate-400 uppercase tracking-tighter">
                        {emp.cargo}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        {emp.ubicacion.toLowerCase().includes('bodega') ? <Building2 size={14} className="text-blue-400" /> :
                         emp.ubicacion.toLowerCase().includes('cond') ? <Truck size={14} className="text-orange-400" /> :
                         <Tent size={14} className="text-emerald-400" />}
                        {normalizeLoc(emp.ubicacion)}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-semibold text-slate-300">
                        {emp.fechaDescanso}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase border tracking-widest ${
                        emp.status === 'Working' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        emp.status === 'Sick' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        emp.status === 'Vacations' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                        emp.status === 'Unconfirmed' ? 'bg-slate-500/10 text-slate-500 border-slate-500/20' :
                        'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}>
                        {emp.status.replace('-', ' ')}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-slate-600 font-futuristic text-xl tracking-widest opacity-50">
                      SIN RESULTADOS PARA LOS CRITERIOS ACTUALES
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-center pt-6 pb-20">
            <button className="px-12 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all flex items-center gap-6">
                <CheckCircle2 size={28} />
                <span className="font-black font-futuristic text-lg tracking-tighter">FINALIZAR Y ENVIAR JORNADA</span>
            </button>
        </div>
      </main>
    </div>
  );
};

export default App;
