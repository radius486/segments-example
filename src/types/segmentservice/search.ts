import type { Paging, PagingResult } from '@/types/paging.ts';
import type { SegmentDto } from './dto.js';

export interface SegmentSearch extends Paging {
  id?: string | null;
  name?: string | null;
  profiles?: string | null;
  searchString?: string | null;
}

export interface ProfileSearch extends Paging {
  searchString?: string | null;
}

export interface SegmentSearchResult extends PagingResult {
  items: SegmentDto[] | null;
}

export interface SegmentProfilesPagination {
  totalPages: number;
  totalItems: number;
}

export interface ParameterListInstancesResult extends PagingResult {
  items: any[] | null;
}
