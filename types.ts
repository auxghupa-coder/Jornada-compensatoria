
export interface Employee {
  id: string;
  nombre: string;
  cargo: string;
  fechaDescanso: string;
  ubicacion: string;
  observacion?: string; // Campo para las notas de gerencia
}

export type PersonnelStatus = 'Resting' | 'Working' | 'Vacations' | 'Sick' | 'Unconfirmed' | 'Both' | '26-Dec' | '02-Jan';

export interface DashboardStats {
  totalPersonnel: number;
  restingDec26: number;
  restingJan2: number;
  vacations: number;
  activeWorkforce: number;
}
