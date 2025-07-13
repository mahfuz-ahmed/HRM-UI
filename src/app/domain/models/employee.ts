export interface Employee {
  id: number;
  userID: string;
  fullName: string;
  email: string;
  password: string;
  isActive: boolean;
  isAdmin: boolean;
  joinDate: Date;
  entryUserID: string;
  entryDate: Date;
  updateUserID: string | null;
  updateDate: Date | null;
}
