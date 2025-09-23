export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'pending' | 'active' | 'rejected';
  created_at: string;
  updated_at: string;
   photoUrl?: string;
}