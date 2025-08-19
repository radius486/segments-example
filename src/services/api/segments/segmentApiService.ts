import { useApiStore } from '@/stores/api.js';
import { Paging } from '@/types/paging';
import {
  SegmentSearch,
  AvailableConditionsDto,
  SegmentSearchResult,
  SegmentInstanceDto,
  SegmentInfoDto,
  SegmentProfileResultsDto,
  ProfileSearch,
  ParameterListInstancesResult,
} from '@/types/segmentservice';

export default {
  async getSummary(segmentSearch: SegmentSearch): Promise<SegmentSearchResult> {
    const api = useApiStore();

    const payload = {
      ...segmentSearch,
      pageSize: 10,
    };

    const response = await api.post('/api/v1/segments/summary', payload);

    return response.data;
  },
  async getSegmentById(segmentId: string): Promise<SegmentInstanceDto> {
    const api = useApiStore();
    const response = await api.get(`/api/v1/segments/${segmentId}`);

    return response.data;
  },
  async editSegmentById(segmentId: string, segment: Partial<SegmentInstanceDto>): Promise<void> {
    const api = useApiStore();
    await api.put(`/api/v1/segments/${segmentId}`, segment);
  },
  async createSegment(segment: Partial<SegmentInstanceDto>): Promise<Record<string, string>> {
    const api = useApiStore();
    const response = await api.post('/api/v1/segments', segment);

    return response.data;
  },
  async deleteSegmentById(segmentId: string): Promise<void> {
    const api = useApiStore();
    await api.delete(`/api/v1/segments/${segmentId}`);
  },
  async getAvailableConditions(): Promise<AvailableConditionsDto> {
    const api = useApiStore();
    const response = await api.get('/api/v1/segments/available-conditions');

    return response.data;
  },
  async getAvailableStores() {
    const api = useApiStore();
    const response = await api.get('/api/v1/segments-test/available-stores');

    return response.data;
  },
  async evaluateSegmentById(segmentId: string): Promise<SegmentInfoDto> {
    const api = useApiStore();
    const response = await api.post(`/api/v1/segments/${segmentId}/evaluate`, {});

    return response.data;
  },
  async getSegmentProfilesById(
    segmentResultId: string,
    profileSearch: ProfileSearch
  ): Promise<SegmentProfileResultsDto> {
    const api = useApiStore();
    const response = await api.post(`/api/v1/segments/results/${segmentResultId}/audience/search`, profileSearch);

    return response.data;
  },
  async getParameterListInstances(path: string): Promise<ParameterListInstancesResult> {
    const api = useApiStore();

    const paging: Paging = {
      page: 1,
      pageSize: 1000,
    };

    const response = await api.post(path, paging);

    return response.data as ParameterListInstancesResult;
  },
  async getParameterDetails(path: string): Promise<Record<string, string>> {
    const api = useApiStore();

    const response = await api.get(path);

    return response.data as Record<string, string>;
  },
};
