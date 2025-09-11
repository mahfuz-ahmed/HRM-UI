export interface UserDetails {
    id: number;
    userID: number;
    firstName: string;
    lastName?: string;
    gender?: string;
    birthDate: Date;
    nidNumber: number;
    departmentID: number;
    designationID: number;
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
