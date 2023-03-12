export interface IHttpPaging {
    per_page: string;
    page: string;
    total_count?:string;
    total_items?:string;
    search?: string;
    after?: string;
    before?: string;
}