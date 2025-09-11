export interface SignUpUserDto {
    id: number;
    companyID: number;
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
