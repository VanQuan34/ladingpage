import { IHttpConfig } from './http-config';
export interface IHttpConfigChild {
    key: string;
    service?: IHttpConfig;
}