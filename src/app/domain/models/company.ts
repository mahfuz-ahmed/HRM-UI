
export interface Company {
  id: number;
  email: string;
  name: string;
  address: string;
  phone: number;
  web: string;
  fax: number;
  logo: string;
  entryUserID: number;
  entryDate: string; 
  updateUserID?: number;
  updateDate?: string; 
}
