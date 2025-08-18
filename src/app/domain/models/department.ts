export interface Department {
    id: number;
    companyId: number;
    departmentCode: string;
    departmentName: string;
    isActive: boolean;
    entryUseId: number;
    entryDate: Date;
    updateUserId?: number;
    updateDate?: Date;
}
