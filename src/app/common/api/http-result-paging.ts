export interface IHttpResultPaging {
    cursors?: IHttpResultPagingCursor;
    page?: number;
    page_count?: number;
    per_page?: number;
    total_count?: number;
    total_items?: number;
    total_page?: number;
    total_item?: number;
}

interface IHttpResultPagingCursor {
    after?: number;
    before?: number;
}