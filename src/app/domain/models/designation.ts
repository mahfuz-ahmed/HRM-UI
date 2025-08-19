export interface Designation {
    id: number;
    companyID: number;
    departmentID: number;
    designationCode: string;
    designationName: string;
    isActive: boolean;
    entryUserID: number;
    entryDate: Date;
    updateUserID?: number;
    updateDate?: Date | null;
}
