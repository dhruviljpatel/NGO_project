export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}
