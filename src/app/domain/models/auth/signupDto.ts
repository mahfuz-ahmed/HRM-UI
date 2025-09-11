import { SignUpUserDto } from './userDto';

export interface SignUpDto {
    id: number;
    email: string;
    name: string;
    address: string;
    phone: number;
    web: string;
    fax: number;
    logo: string;
    entryUserID: number;
    entryDate: Date;
    updateUserID: string | null;
    updateDate: Date | null;
    userDto: SignUpUserDto | null;
}
