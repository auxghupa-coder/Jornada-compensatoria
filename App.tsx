
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, Calendar, MapPin, 
  Search, CheckCircle2, AlertCircle, 
  LogOut, Activity, ShieldAlert, Tent, 
  Database, Zap, ListFilter, ArrowRightLeft,
  Menu, FileUp, Info, RefreshCw
} from 'lucide-react';
import { RAW_DATA } from './data';
import { Employee } from './types';

// MAPEO DE OBSERVACIONES PROPORCIONADO POR GERENCIA
const OBSERVATIONS_MAP: Record<string, string> = {
  "ESCOBAR TABORDA WILMAR ANDRES": "22-12 al 28-12",
  "RICARDO VEGA JHON JAVIER": "29-12 al 06-01",
  "HIGUITA MEJIA FABIO ALONSO": "Adelanto vacaciones",
  "GARCIA GARCIA WILSON DE JESUS": "Adelanto vacaciones",
  "BORJA FRANCO HERMIN ALONSO": "Adelanto vacaciones",
  "CANO OSPINA GILDARDO DE JESUS": "Adelanto vacaciones",
  "TORRES EMILSON": "Adelanto vacaciones",
  "HERRERA GONZALEZ HAROLD": "Adelanto vacaciones",
  "TORRES CADAVID ESTIVEN": "Adelanto vacaciones",
  "MISATH PALOMINO VICTOR ANTONIO": "Adelanto vacaciones",
  "MURILLO MADRIGAL FERNEY DARIO": "Adelanto vacaciones",
  "BETANCUR USUGA DEIMER EULICE": "Adelanto vacaciones",
  "RODAS PIEDRAHITA MANUEL SALVADOR": "Adelanto vacaciones",
  "RAMOS RAMOS JORGE LUIS": "Adelanto vacaciones",
  "PATERNINA LONDOÑO YERMI ENRIQUE": "Adelanto vacaciones",
  "QUINTERO QUINTERO JUAN HERNEY": "Adelanto vacaciones",
  "PALACIOS MOSQUERA JACKSON ARIEL": "Adelanto vacaciones",
  "CAÑAVERAL MARULANDA CRISTOBAL ANTONIO": "Adelanto vacaciones",
  "GUZMAN ALMANZA CARMELO MIGUEL": "Adelanto vacaciones",
  "BEDOYA PINO JUAN ANDRES": "Adelanto vacaciones",
  "ZABALA RODRIGUEZ CESAR AUGUSTO": "Adelanto vacaciones",
  "PALENCIA RAMOS JOSE DAVID": "Adelanto vacaciones",
  "LOPEZ PADILLA WEINER ALBERTO": "Adelanto vacaciones",
  "ARTEAGA OSPINA ERIKA TATIANA": "Adelanto vacaciones",
  "OVIEDO ORTEGA RAUL ENRIQUE": "Adelanto vacaciones",
  "MONSALVE LONDOÑO DANILO": "N/A",
  "RUA ROMERO JHON EDISON": "N/A",
  "PEÑA RAFAEL ORANGEL": "No cumple",
  "LOPEZ PEREZ ESKAR SAMUEL": "No cumple",
  "ALVARADO SANCHEZ HECTOR RICARDO": "No cumple",
  "PULGARIN CARTAGENA SANTIAGO ANDRES": "No cumple",
  "MAJORE DOMICO EMILIANO": "Adelanto vacaciones",
  "HERRERA PINTO DAVID FERNANDO": "Adelanto vacaciones",
  "ARIAS QUIRAMA JUAN DAVID": "Adelanto vacaciones",
  "MARTINEZ CUESTA ELIAS": "Adelanto vacaciones",
  "LOPEZ CANDAMIL ARIEL": "Adelanto vacaciones",
  "PALACIOS PEREA NEIDER": "Adelanto vacaciones",
  "GARCIA ESPINOSA HANDER YOSIMI": "Adelanto vacaciones",
  "NOREÑA TABORDA DUBER STIVEN": "16-12 al 29-12",
  "ARBELAEZ QUINCHIA HERNAN DARIO": "Cumpleaños",
  "BRACHO GIOVANNY JOSE": "Adelanto vacaciones",
  "RENDON RUA DIEGO ALBERTO": "Adelanto vacaciones",
  "VANEGAS USUGA YEFERSON ALBERTO": "Adelanto vacaciones",
  "FAJARDO CROSS YAN CARLOS": "Adelanto vacaciones",
  "QUEJADA SANTOS ALCIDES": "Adelanto vacaciones",
  "PADILLA SEVERICHE FRANCOLLI": "Adelanto vacaciones",
  "DIAZ RAMOS MARLON DAVID": "Adelanto vacaciones",
  "USUGA CORDOBA DANIEL DAVID": "Adelanto vacaciones",
  "POSSO JIMENEZ WILMAR ALEXANDER": "Adelanto vacaciones",
  "ARANGO POSADA MARTIN FELIPE": "Adelanto vacaciones",
  "TAPIAS MESA JHON JAIRO": "Adelanto vacaciones",
  "MANCO PATIÑO WALTHER ALEXANDER": "Adelanto vacaciones",
  "MURILLO DIAZ CRISTIAN ANDRES": "Adelanto vacaciones",
  "QUINTERO BARRIENTOS SANTIAGO": "Adelanto vacaciones",
  "YEPES CLAVIJO JOHN BYRON": "Adelanto vacaciones",
  "PINEDA VILLA RICHAR ESTEBAN": "Adelanto vacaciones",
  "TUBERQUIA GOMEZ JOHN EDWIN": "Adelanto vacaciones",
  "ALZATE ACEVEDO SANTIAGO": "Adelanto vacaciones",
  "SANCHEZ GARCIA YONATAN ALEJANDRO": "Adelanto vacaciones",
  "ROLDAN LONDOÑO JUAN CAMILO": "Adelanto vacaciones",
  "RUJANO GUASAMUCARO ELOY": "Adelanto vacaciones",
  "RENDON BERNAL RIGOBERTO": "Adelanto vacaciones",
  "LLORENTE LOPEZ ARLIS WILLIAM": "Adelanto vacaciones",
  "ROMAÑA MORENO ELASIO": "Adelanto vacaciones",
  "SANCHEZ SALDARRIAGA CHARLIE LEON": "Adelanto vacaciones",
  "ECHEVERRI ALBERTINO OMAR YESID": "Adelanto vacaciones",
  "NOBLE MUSLACO JOSE ALFONSO": "Adelanto vacaciones",
  "DIAZ RUA CATTERINE ALEXANDRA": "Adelanto vacaciones",
  "VELEZ PANTOJA NORMAN ARTURO": "No cumple",
  "BEJARANO MOSQUERA GUSTAVO ADOLFO": "No cumple",
  "HERNANDEZ PEREIRA DANIS DANIEL": "No cumple",
  "SIERRA CALLE IVAN ANTONIO": "No cumple",
  "ESTRADA GUERRA VIVIAN DE JESUS": "No cumple",
  "FLOREZ ALVAREZ JUAN DAVID": "No cumple",
  "MENA POTES LUIS FERNANDO": "No cumple",
  "CARDENAS RAMOS ENDER JOSE": "Adelanto vacaciones",
  "ARANGO ZAPATA JOSE DUCLIDES": "29-12 al 06-01",
  "GUTIERREZ MORENO NELSON ANDRES": "Adelanto vacaciones",
  "OSCAR ANDRADE URANGO": "Adelanto vacaciones",
  "ALDOVER ARISTIZABAL GIRALDO": "Adelanto vacaciones",
  "HERNAN DARIO JARAMILLO PALACIOS": "Adelanto vacaciones",
  "JUAN CARLOS QUINTANA CANO": "Adelanto vacaciones",
  "DAIRO HERRERA GUARNE": "Adelanto vacaciones",
  "YORBIS ALBERTO GONZALEZ GUILLEN": "Adelanto vacaciones",
  "RICARDO ANDRES MORALES ITURRIAGO": "Adelanto vacaciones",
  "DAIRO JOHANY ZULETA HENAO": "Adelanto vacaciones",
  "RAFAEL ANGEL GARCES GUTIERREZ": "Adelanto vacaciones",
  "VILORIA SUAREZ JONAIKER DAVID": "Adelanto vacaciones",
  "ARGEL BRU LIBARDO ANTONIO": "Adelanto vacaciones",
  "RUA PEREZ OCTAVIO ALFONSO": "Adelanto vacaciones",
  "MEDRANO FLOREZ LUIS MIGUEL": "Adelanto vacaciones",
  "ZAPATA SANCHEZ MIGUEL ANGEL": "Adelanto vacaciones",
  "GUERRERO ROA LUIS GORGONIO": "Adelanto vacaciones",
  "ACOSTA CASTRO EDILBERTO JOSE": "16-12 al 05-01",
  "ARENAS VILLA JUAN DE DIOS": "Adelanto vacaciones",
  "PARRA RUIZ GUSTAVO ADOLFO": "Adelanto vacaciones",
  "FORONDA MARIN LUIS MEDARDO DE JESUS": "Adelanto vacaciones",
  "ARDILA FRANKLIN ESTEBAN": "Adelanto vacaciones",
  "BETANCUR CONCHA WILMAR ANTONIO": "Adelanto vacaciones",
  "PEREZ ZABALA WALTER DE JESUS": "Adelanto vacaciones",
  "JIMENEZ NORBEY DE JESUS": "Adelanto vacaciones",
  "MAZO PEREZ JOAQUIN EMILIO": "Adelanto vacaciones",
  "HIGUITA MISAS JORGE EMILIO": "Adelanto vacaciones",
  "GIL TALERO JOSE ELGAR": "Adelanto vacaciones",
  "SEPULVEDA JIMENEZ WALTER EDISON": "Adelanto vacaciones",
  "PATIÑO LOPEZ WALTER JULIAN": "Adelanto vacaciones",
  "HERNANDEZ BENITEZ JAIDER FERNANDO": "Adelanto vacaciones",
  "PALACIOS PALACIOS JHON": "Adelanto vacaciones",
  "GONZALEZ ARIAS ADRIANA ISABEL": "Adelanto vacaciones",
  "ROBLEDO CORDOBA YARLEISON": "Adelanto vacaciones",
  "MORENO ORTIZ EDISON FERNANDO": "Adelanto vacaciones",
  "RIVERA MORENO MARCOS FIDEL": "Adelanto vacaciones",
  "GONZALEZ MARTINEZ NID BRAHIAN": "Adelanto vacaciones",
  "PALACIOS ORTIZ JORGE LUIS": "Adelanto vacaciones",
  "LOPERA MEJIA MICHAEL ESTIVEN": "Adelanto vacaciones",
  "ARBOLEDA LOPEZ DAIRON ALBERTO": "Adelanto vacaciones",
  "USUGA QUIROS SEBASTIAN": "Adelanto vacaciones",
  "VILORIA FUENTES YONIER": "Adelanto vacaciones",
  "GONZALEZ ZAMARRA WILMAR DE JESUS": "Adelanto vacaciones",
  "LONDOÑO GIRALDO JOSETH": "Adelanto vacaciones",
  "DIAZ OSPINA LUIS ALBERTO": "Adelanto vacaciones",
  "URREGO ALVAREZ NELSON UBEIMAR": "Adelanto vacaciones",
  "MOSQUERA RENTERIA CARLOS ENRIQUE": "Adelanto vacaciones",
  "RAMOS MURILLO ALEXANDER STEFAN": "Adelanto vacaciones",
  "RUIZ LARREA JUAN PABLO": "Adelanto vacaciones",
  "TUBERQUIA PALACIO JOHN FREDY": "Adelanto vacaciones",
  "RUIZ LOAIZA AUDI DE JESUS": "Adelanto vacaciones",
  "ORTIZ CANO JOSE LUIS": "Adelanto vacaciones",
  "RESTREPO AGUDELO BERNARDO DE JESUS": "Adelanto vacaciones",
  "HINCAPIE CEBALLOS JAVIER DE JESUS": "Adelanto vacaciones",
  "RIOS PALACIOS BLADER STIVEN": "Adelanto vacaciones",
  "PALACIOS MORENO FABIAN ANDRES": "Adelanto vacaciones",
  "ESTRADA RUIZ FRANCISCO JAVIER": "Adelanto vacaciones",
  "MOSQUERA MEDINA JHON ALEX": "Adelanto vacaciones",
  "AGUDELO CASTAÑO DANIEL": "Adelanto vacaciones",
  "VELASQUEZ DAVILA YEFRI DE JESUS": "Adelanto vacaciones",
  "MONTOYA MIRA DIEGO FERNANDO": "Adelanto vacaciones",
  "DUARTE SERNA ALEXANDER": "Adelanto vacaciones",
  "BEDOYA BORJA JONATHAN STIVEN": "Adelanto vacaciones",
  "ESCOBAR CORTES ANDRES FELIPE": "Adelanto vacaciones",
  "GUISAO NOREÑA KEVIN DANIEL": "Adelanto vacaciones",
  "TABORDA ACEVEDO JHOYNER DAVID": "Adelanto vacaciones",
  "ORTIZ TORRES YADIR STIVEN": "Adelanto vacaciones",
  "BARBERO FLOREZ EDUIN JOSE": "Adelanto vacaciones",
  "LASSO LOPEZ DAVID FERNEY": "Adelanto vacaciones",
  "CASTAÑEDA ZAPATA EDWIN DARIO": "Adelanto vacaciones",
  "PALOMEQUE BENITEZ EDGAR LUIS": "Adelanto vacaciones",
  "SEPULVEDA GIRALDO JHOAN SEBASTIAN": "Adelanto vacaciones",
  "AGUIRRE URREGO LEANDRO ANTONIO": "Adelanto vacaciones",
  "PALACIO ZULUAGA JUAN CAMILO": "Adelanto vacaciones",
  "GOMEZ PEREZ DIEGO ALONSO": "Adelanto vacaciones",
  "SUAREZ CANCHILA OSCAR DARIO": "Adelanto vacaciones",
  "RODRIGUEZ MORENO ANGEL AMERICO": "Adelanto vacaciones",
  "GIRALDO GARCIA YHONATAN": "Adelanto vacaciones",
  "LOPEZ HERRERA JONATHAN": "Adelanto vacaciones",
  "GUERRA USUGA SEBASTIAN DE JESUS": "Adelanto vacaciones",
  "CORDOBA CHALA DIEGO": "Adelanto vacaciones",
  "ESPINOSA MANCO LUIS MIGUEL": "Adelanto vacaciones",
  "CORREA CIRO DIOMER ALEXANDER": "Adelanto vacaciones",
  "AGAMEZ PADILLA JUAN PABLO": "Adelanto vacaciones",
  "ALVAREZ PINEDA ANGEL DANIEL": "Adelanto vacaciones",
  "GOEZ ZULETA DUVAN ARLEY": "Adelanto vacaciones",
  "RIOS RESTREPO JOAN ESTEBAN": "Adelanto vacaciones",
  "MONTES SALDARRIAGA JOHN FREDY": "Adelanto vacaciones",
  "PADIERNA SANCHEZ LEONEL": "Adelanto vacaciones",
  "GOEZ GUISAO DAVINSON ANTONIO": "Adelanto vacaciones",
  "PINEDA COSME EFRAIN": "Adelanto vacaciones",
  "ACEVEDO SANCHEZ EDWIN ORLANDO": "Adelanto vacaciones",
  "MONROY GIRALDO JUAN BAUTISTA": "Adelanto vacaciones",
  "CASTILLO CARDENAS CARLOS JAVIER": "Adelanto vacaciones",
  "GIRALDO ZAPATA JUAN FELIPE": "Adelanto vacaciones",
  "CADAVID ORREGO LUISA FERNANDA": "Adelanto vacaciones",
  "JIMENEZ BETANCOURTH YORMAN ESTIBEN": "Adelanto vacaciones",
  "BURGOS ZAPATA JOHNNY ANDRES": "Adelanto vacaciones",
  "GALLEGO ALZATE JENNIFER ANDREA": "Adelanto vacaciones",
  "VALLE GUERRA DAVINSON": "Adelanto vacaciones",
  "GALINDO LOPEZ JEFFERSON ANDRES": "Adelanto vacaciones",
  "ALZATE HIGINIO UBER ANTONIO": "Adelanto vacaciones",
  "GOMEZ CORREA GUSTAVO ADOLFO": "Adelanto vacaciones",
  "RESTREPO MEJIA NELSON ANDRES": "Adelanto vacaciones",
  "RAMIREZ CHAVARRIA ANDRES FELIPE": "Adelanto vacaciones",
  "MESA CARMONA YEFREY": "Adelanto vacaciones",
  "CARO ARBOLEDA JOHAN ALEXIS": "Adelanto vacaciones",
  "MANCO VALLE ALBA NUBIA": "Adelanto vacaciones",
  "MONTOYA GUTIERREZ CARLOS ANDRES": "Adelanto vacaciones",
  "MUÑOZ ZAPATA BRANDON STIVEN": "Adelanto vacaciones",
  "CATAÑO ORREGO JULIET NATALIA": "Adelanto vacaciones",
  "CADAVID RIOS GABRIEL JAIME": "No cumple",
  "RAMIREZ HERNANDEZ JOHAN CAMILO": "Adelanto vacaciones",
  "PAYARES GENEY LEONARDO DOMINGO": "Adelanto vacaciones",
  "BERRIO GUARIN LEIDER": "Adelanto vacaciones",
  "GOMEZ GIL JUAN PABLO": "Adelanto vacaciones",
  "MOSQUERA BENITEZ MARLEN YULIETH": "Adelanto vacaciones",
  "ROMAN BARRERA MARLON YESSID": "Adelanto vacaciones",
  "RUIZ CRISTINA MARCELA": "Adelanto vacaciones",
  "CADENA HENAO MARTHA YULITZA": "Adelanto vacaciones",
  "URREGO CARVAJAL MARIA NATALIA": "Adelanto vacaciones",
  "LONDOÑO PELAEZ XIMENA": "Adelanto vacaciones",
  "MANCO VARGAS BRAYAN ALEXIS": "Adelanto vacaciones",
  "BOTERO RIVERA MARIANA": "Adelanto vacaciones",
  "VANEGAS CADAVID YULI PAULINA": "Adelanto vacaciones",
  "BEDOYA SUAREZ ANDRES FELIPE": "Adelanto vacaciones",
  "ROMAN RESTREPO YUDY VANESA": "Adelanto vacaciones",
  "CAMAYO LOPEZ JHONATAN FERNEY": "Adelanto vacaciones",
  "GARCIA MORALES PAOLA ANDREA": "Adelanto vacaciones",
  "BURGOS GARCIA LUIS EDUARDO": "Adelanto vacaciones",
  "MEJIA LONDOÑO MARCELA": "Adelanto vacaciones",
  "VASQUEZ AREIZA ALEXANDER DE JESÚS": "Adelanto vacaciones",
  "MAYA RUA CARLOS ALBERTO": "Adelanto vacaciones",
  "ARIAS CUBIDES JUAN ESTEBAN": "Adelanto vacaciones",
  "BOHORQUEZ LOPEZ EDWIN LEANDRO": "Adelanto vacaciones",
  "ROMAN BARRERA MANUEL STIVEN": "Adelanto vacaciones",
  "CORDOBA PALACIOS CRISTIAN CAMILO": "Adelanto vacaciones",
  "CARDEÑO MONTES OTONIEL DE JESUS": "Adelanto vacaciones",
  "JAIRO ALONSO GARCIA RODRIGUEZ": "31-12 al 13-01",
  "GALLON GARCIA KATTERIN LUCIA": "Adelanto vacaciones",
  "DAVISNEY HERRERA PEREZ": "Adelanto vacaciones",
  "JUAN CAMILO LONDOÑO HENAO": "Adelanto vacaciones",
  "ENER LUIS HERRERA WUARNES": "Adelanto vacaciones",
  "GARCES MORALES JUAN JOSE": "Adelanto vacaciones",
  "HERNANDEZ LOPEZ CARLOS ANDRES": "No cumple",
  "TEJADA CARDONA YESSICA PAOLA": "No cumple",
  "SILVA PIEDRAHITA OSCAR URIEL": "No cumple",
  "MOSQUERA LEUDO YEISON EMILIO": "Adelanto vacaciones",
  "CORREA ESCALANTE JUAN PABLO": "No cumple",
  "ECHAVARRIA BORJA DUVAN ALONSO": "No cumple",
  "GARCIA LOPEZ MILVIA HELENA": "No cumple",
  "CORREA PANIAGUA ALEXANDER": "26-12 al 05-01",
  "MESTRA BARRAGAN CARLOS ALFREDO": "No cumple",
  "HENAO GAVIRIA JUAN DAVID": "Adelanto vacaciones",
  "DURANGO ALZATE JUDIT PATRICIA": "Adelanto vacaciones",
  "OVIEDO HERNANDEZ WILMER ANDRES": "No cumple",
  "AGUDELO ORTIZ LUIS ALFONSO": "Sin confirmar",
  "VAHOS GALVIS BRIAN ALEXIS": "Adelanto vacaciones",
  "SUAREZ PEREZ LUIS FERNANDO": "Sin confirmar",
  "LOPEZ LOPEZ JOAN ESTEBAN": "Sin confirmar",
  "MUÑOZ BRAN JORGE NELSON": "Sin confirmar",
  "RIOS AGUIRRE SANTIAGO ALEXIS": "Sin confirmar",
  "PEREA PEREA DANOBER": "19-12 al 13-01",
  "SERNA MUÑOZ LUIS ALBERTO": "Sin confirmar",
  "ALDANA VALLE FRANCISCO JAVIER": "N/A",
  "VALDERRAMA ZULETA HENRY ALONSO": "N/A"
};

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
  const [locationFilter, setLocationFilter] = useState('Todo');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('nexus_personnel_data');
    if (savedData) {
      setEmployees(JSON.parse(savedData));
    } else {
      const enriched = RAW_DATA.map(emp => ({
        ...emp,
        observacion: OBSERVATIONS_MAP[emp.nombre] || "N/A"
      }));
      setEmployees(enriched);
    }
  }, []);

  const normalizeLoc = (loc: string) => loc.charAt(0).toUpperCase() + loc.slice(1).toLowerCase().trim();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let data: Employee[] = [];

        if (file.name.endsWith('.json')) {
          data = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          data = lines.slice(1).filter(l => l.trim() !== '').map(line => {
            const values = line.split(',').map(v => v.trim());
            const obj: any = {};
            headers.forEach((h, i) => obj[h] = values[i]);
            return obj as Employee;
          });
        }

        const fullyEnriched = data.map(emp => ({
          ...emp,
          observacion: emp.observacion || OBSERVATIONS_MAP[emp.nombre] || "N/A"
        }));

        setEmployees(fullyEnriched);
        localStorage.setItem('nexus_personnel_data', JSON.stringify(fullyEnriched));
        alert('Base de datos sincronizada correctamente.');
      } catch (err) {
        console.error(err);
        alert('Error en el formato del archivo.');
      }
    };
    reader.readAsText(file);
  };

  const processedData = useMemo(() => {
    return employees.map(emp => {
      const f = emp.fechaDescanso.toLowerCase();
      let status = 'Other';
      
      const hasDec26 = f.includes('26 de diciembre');
      const hasJan02 = f.includes('2 de enero') || f.includes('02 de enero');

      if (hasDec26 && hasJan02) status = 'Both';
      else if (hasDec26) status = '26-Dec';
      else if (hasJan02) status = '02-Jan';
      else if (f.includes('vacaciones')) status = 'Vacations';
      else if (f.includes('no sale')) status = 'Working';
      else if (f.includes('incapacitado')) status = 'Sick';
      else if (f.includes('sin confirmar')) status = 'Unconfirmed';
      
      return { ...emp, status };
    });
  }, [employees]);

  const locations = useMemo(() => ['Todo', ...Array.from(new Set(processedData.map(d => normalizeLoc(d.ubicacion))))], [processedData]);

  const filteredData = useMemo(() => {
    return processedData.filter(emp => {
      const matchesSearch = emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           emp.id.includes(searchTerm) || 
                           emp.cargo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === 'Todo' || normalizeLoc(emp.ubicacion) === locationFilter;
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [searchTerm, locationFilter, statusFilter, processedData]);

  const stats = useMemo(() => ({
    total: processedData.length,
    working: processedData.filter(d => d.status === 'Working').length,
    vacations: processedData.filter(d => d.status === 'Vacations').length,
    unconfirmed: processedData.filter(d => d.status === 'Unconfirmed').length,
    sick: processedData.filter(d => d.status === 'Sick').length,
    both: processedData.filter(d => d.status === 'Both').length,
    dec26: processedData.filter(d => d.status === '26-Dec').length,
    jan02: processedData.filter(d => d.status === '02-Jan').length,
  }), [processedData]);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      {/* Sidebar */}
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
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 space-y-8 overflow-y-auto h-screen relative scroll-smooth">
        
        {/* HUD MONITOR SUPERIOR */}
        <header className="sticky top-0 z-40 bg-[#020617]/40 backdrop-blur-3xl rounded-[2.5rem] -mx-4 px-4 py-2">
          <div className="glass-effect p-6 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* IZQUIERDA: Titulo e Index */}
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-cyan-500 tracking-[0.4em] uppercase mb-1">Novedades Jornada Compensatoria</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-futuristic font-black text-white tracking-tighter">
                    {filteredData.length}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-slate-500 font-bold text-lg leading-none">/ {processedData.length}</span>
                    <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest mt-1">Sincronizados</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CENTRO: NOTA DE GERENCIA SOLICITADA */}
            <div className="hidden xl:flex flex-1 justify-center px-4">
               <div className="glass-effect px-6 py-3 rounded-2xl border border-cyan-500/30 flex items-center gap-4 animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0"></div>
                  <Info size={18} className="text-cyan-400 shrink-0" />
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-200 text-center leading-relaxed">
                    24 y 31 de diciembre todo el personal descansa.<br/>
                    <span className="text-cyan-500">Se pagaron con tiempo los sábados 13 y 29 de diciembre.</span>
                  </p>
               </div>
            </div>

            {/* DERECHA: Herramientas */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar nombre o ID..."
                  className="bg-slate-950/80 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-xs font-bold focus:outline-none focus:border-cyan-500/50 w-full md:w-64 transition-all shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.json" onChange={handleFileUpload} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 text-slate-400 transition-all hover:text-cyan-400"
                title="Sincronizar Fuente"
              >
                <FileUp size={20} />
              </button>

              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('All'); setLocationFilter('Todo'); }}
                className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 text-slate-400 transition-all hover:text-cyan-400"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </header>

        {activeView === 'dashboard' && (
          <>
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-futuristic font-black text-white tracking-tighter uppercase">Análisis <span className="text-cyan-500">Operativo</span></h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Monitoreo de compensaciones y programación de cierre de año</p>
            </div>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard title="26 DICIEMBRE" value={stats.dec26} icon={Calendar} color="text-purple-400" active={statusFilter === '26-Dec'} onClick={() => setStatusFilter('26-Dec')} subtitle="Receso Programado" />
              <StatCard title="02 ENERO" value={stats.jan02} icon={Calendar} color="text-blue-400" active={statusFilter === '02-Jan'} onClick={() => setStatusFilter('02-Jan')} subtitle="Receso Programado" />
              <StatCard title="AMBOS DÍAS" value={stats.both} icon={Zap} color="text-indigo-400" active={statusFilter === 'Both'} onClick={() => setStatusFilter('Both')} subtitle="Doble Descanso" />
              <StatCard title="SIN SALIDA" value={stats.working} icon={CheckCircle2} color="text-emerald-400" active={statusFilter === 'Working'} onClick={() => setStatusFilter('Working')} subtitle="Operativo" />
              <StatCard title="VACACIONES" value={stats.vacations} icon={Tent} color="text-orange-400" active={statusFilter === 'Vacations'} onClick={() => setStatusFilter('Vacations')} />
              <StatCard title="PENDIENTES" value={stats.unconfirmed} icon={AlertCircle} color="text-slate-400" active={statusFilter === 'Unconfirmed'} onClick={() => setStatusFilter('Unconfirmed')} />
              <StatCard title="INCAPACITADOS" value={stats.sick} icon={ShieldAlert} color="text-red-400" active={statusFilter === 'Sick'} onClick={() => setStatusFilter('Sick')} />
              <StatCard title="TOTAL FUERZA" value={stats.total} icon={Database} color="text-cyan-400" active={statusFilter === 'All'} onClick={() => setStatusFilter('All')} />
            </section>

            {/* Tabla con columna OBSERVACIÓN */}
            <section className="glass-effect rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl transition-all">
              <div className="p-8 border-b border-white/5 flex flex-wrap items-center justify-between gap-6 bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
                  <h3 className="text-xl font-futuristic font-black tracking-tight uppercase text-white">Detalle Operativo</h3>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Filtro Zona:</span>
                    <select 
                      className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase focus:outline-none focus:border-cyan-500 cursor-pointer text-slate-300"
                      value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
                    >
                      {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                      <th className="px-8 py-6">ID</th>
                      <th className="px-8 py-6">Colaborador</th>
                      <th className="px-8 py-6">Ubicación</th>
                      <th className="px-8 py-6">Programación</th>
                      <th className="px-8 py-6">Observación Especial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredData.length > 0 ? filteredData.map((emp) => (
                      <tr key={emp.id} className="hover:bg-cyan-500/[0.03] transition-all group border-l-2 border-transparent hover:border-cyan-500">
                        <td className="px-8 py-5 font-mono text-[11px] text-slate-500 group-hover:text-cyan-400">#{emp.id}</td>
                        <td className="px-8 py-5">
                          <span className="font-bold text-white uppercase text-xs group-hover:translate-x-1 transition-transform inline-block">{emp.nombre}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-slate-300 text-[11px] font-bold">
                            <MapPin size={14} className="text-cyan-500/40" />
                            {normalizeLoc(emp.ubicacion)}
                          </div>
                        </td>
                        <td className="px-8 py-5">
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
                        <td className="px-8 py-5">
                          <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-tight ${
                             emp.observacion === 'No cumple' ? 'text-red-400' : 
                             emp.observacion?.includes('Adelanto') ? 'text-cyan-400' :
                             emp.observacion?.includes('al') ? 'text-purple-400' : 'text-slate-500'
                          }`}>
                            <Info size={12} className="opacity-50" />
                            {emp.observacion}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-32 text-center text-slate-500 font-futuristic uppercase tracking-[0.3em] opacity-30">
                            No se encontraron registros activos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* Calendar y Map Views */}
        {activeView === 'calendar' && (
          <div className="p-20 glass-effect rounded-[3rem] border border-white/5 text-center">
            <Calendar size={100} className="mx-auto mb-8 text-cyan-500/40" />
            <h3 className="text-4xl font-futuristic font-black text-white mb-6 uppercase tracking-tighter">Cronograma Operativo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="text-4xl font-futuristic text-purple-400 mb-2">{stats.dec26}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">26 Diciembre</div>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="text-4xl font-futuristic text-blue-400 mb-2">{stats.jan02}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">02 Enero</div>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="text-4xl font-futuristic text-indigo-400 mb-2">{stats.both}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Doble Turno</div>
                </div>
            </div>
          </div>
        )}

        {activeView === 'map' && (
          <div className="p-12 glass-effect rounded-[3rem] border border-white/5">
             <div className="flex items-center gap-6 mb-12">
                <MapPin className="text-cyan-500" size={40} />
                <h3 className="text-3xl font-futuristic font-black text-white uppercase">Dispersión por Zona</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-40 text-slate-500 uppercase font-black text-xs italic">
                Capa geográfica en proceso de actualización de frentes...
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
