import { IHttpResultPaging } from './http-result-paging';

export interface IHttpResult {
    data?: any;
    code?: number;
    paging?: IHttpResultPaging;
    message?: string;
    update_time?: string;
    errors?: string;
}
