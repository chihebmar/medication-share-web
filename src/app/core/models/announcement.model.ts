import { Reference } from './reference.model';

export interface Announcement {
  id: number;
  medicationName: string;
  type: Reference;
  governorate: Reference;
  state: Reference;
  phoneNumber: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}