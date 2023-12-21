export interface PaginateReponseData {
  data: any;
  metadata: PaginateMetadata & { total: number };
}

export interface PaginateMetadata {
  page: number;
  pageSize: number;
}
