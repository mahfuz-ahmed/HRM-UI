export interface UserDetails {
  id: number;
  userId: number;
  firstName: string; 
  lastName?: string; 
  gender?: string; 
  birthDate: Date; 
  nidNumber: number; 
  departmentId: number;
  designationId: number;
  presentAddress?: string; 
  permanentAddress?: string;
  about?: string; 
  image?: string; 
  signature?: string;
  entryUserId: number; 
  entryDate: Date; 
  updateUserId?: number; 
  updateDate?: Date;
}