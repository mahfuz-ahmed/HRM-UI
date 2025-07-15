import { UserDetails } from "../user-details";

export interface Login {
  id: number;
  companyID: number;
  fullName: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  jwtToken: string;
  refreshToken: string;
  userDetails: UserDetails
}
