import { IHttpResponse } from './http-response';
import { IHttpPaging } from './http-paging';
import { IHttpDetail } from './http-detail';
import { IHttpConfigChild } from './http-child';

export interface IHttpConfig {
    serviceSpecific?: any;
    serviceSpecificFunctionName?: string;
    serviceSpecificResponseOfFunction?: string; // mô tả kiểu dữ liệu của function trả về  Observable  hoặc Promise, mặc định hiểu là Observable
    serviceSpecificParams?: Array<any>; // chứa dữ liệu của params truyền vào, mảng có kểu dữ liệu không cần giống nhau vd: hàm function(search:string,age:number,page:Object)={...} thì serviceSpecificParams = ['param',16,{page:1,page:per_page:25}]
    key?: string;
    baseType?: number;
    method?: any;
    path?: string;
    pathKeys?: Array<string>;
    query?: any;
    body?: any;
    ids?: string; // Không sử dụng nữa, thay thế bằng detail
    idKey?: string;
    per_page?: number; // Không sử dụng nữa, thay thế bằng perPage
    perPage?: number;
    response?: IHttpResponse;
    paging?: IHttpPaging;
    sort?: any;
    paramKeys?: any;
    detail?: IHttpDetail;
    needCache?: boolean; // needCache = true để cache data trả về. Trường hợp muốn refeshCache set needCache = true và clearCache = true;
    clearCache?: boolean; // clearCache = true để xóa cache data;
    child?: Array<IHttpConfigChild>;
    ignoreShowErrorMessage?: boolean;
    successCode?: any;
    isBodySearch?: boolean; // search param thuoc body
    noPaging?: boolean;
}
