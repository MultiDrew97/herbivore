import { IAuth } from '../utils/interfaces';
import { IDbEntry } from '.';
export declare interface IUser extends IDbEntry {
    email: string;
    phone: string;
    login: IAuth;
}
