export interface Paging {
  page: number;
  pageSize: number;
  sortColumn?: string | null;
  descending?: boolean | null;
}
export interface PagingResult {
  pageNumber: number | null;
  totalPages: number | null;
  total: number | null;
  isFirstPage: boolean | null;
  isLastPage: boolean | null;
}
