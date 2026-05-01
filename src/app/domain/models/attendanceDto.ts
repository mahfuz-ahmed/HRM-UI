export interface AttendanceDto {
    id: number;
    companyId: number;
    userId: number;
    fullName: string;
    departmentName: string;
    attendanceDate: string | null;
    checkIn: string | null;
    checkOut: string | null;
    breakMinutes: number;
    totalMinutes: number | null;
    productionMinutes: number | null;
    lateMinutes: number;
    overTimeMinutes: number;
    status: string;
}
