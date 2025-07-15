export interface User {
  id: number;
  companyID: number;
  userID: string;
  fullName: string;
  email: string;
  password: string;
  isActive: boolean;
  isAdmin: boolean;
  joinDate: Date;
  entryUserID: number;
  entryDate: Date;
  updateUserID: string | null;
  updateDate: Date | null;
}
