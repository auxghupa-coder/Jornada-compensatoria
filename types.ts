
export interface Employee {
  id: string;
  nombre: string;
  cargo: string;
  fechaDescanso: string;
  ubicacion: string;
}

export type PersonnelStatus = 'Resting' | 'Working' | 'Vacations' | 'Sick' | 'Unconfirmed';

export interface DashboardStats {
  totalPersonnel: number;
  restingDec26: number;
  restingJan2: number;
  vacations: number;
  activeWorkforce: number;
}
