export interface Attendance {
    id?: number;
    companyID: number;
    userID: number;
    attendanceStatusID: number;
    attendanceDate: string;
    checkIn?: string | null;
    checkOut?: string | null;
    late?: number | null;
    break?: number | null;
    productionHours?: number | null;
    isAdmin: boolean;
    entryUseID: number;
    entryDate: string;
    updateUserID?: number | null;
    updateDate?: string | null;
}
