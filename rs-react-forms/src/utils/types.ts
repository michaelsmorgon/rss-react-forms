export type Gender = 'male' | 'female' | 'other';

export interface UserFormData {
  id: string;
  // source: 'uncontrolled' | 'hookform';
  name: string;
  age: number;
  email: string;
  password: string;
  gender: Gender;
  acceptedTC: boolean;
  country: string;
  imageBase64: string;
  createdAt: number;
}
