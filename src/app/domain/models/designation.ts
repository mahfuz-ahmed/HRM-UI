export interface Designation {
    id: number;
    companyID: number;
    departmentID: number;
    designationName: string;
    isActive: boolean;
    entryUserID: number;
    entryDate: Date;
    updateUserID: string | null;
    updateDate: Date | null;
}
