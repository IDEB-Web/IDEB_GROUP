export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  status?: string;
  google_id?: string;
  telefono?: string;
  zonaHoraria?: string;
  idioma?: string;
  foto?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}
