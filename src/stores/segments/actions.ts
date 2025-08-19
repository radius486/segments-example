import { segmentApiService } from '@/services/index';

import {
  fetchingSegments,
  fetchingSegment,
  savingSegment,
  deletingSegment,
  fetchingProfiles,
  fetchingConditions,
  segments,
  currentSegment,
  segmentSearch,
  segmentSearchStateInitial,
  segmentPagination,
  profilePagination,
  profiles,
  profileSearch,
  profileSearchStateInitial,
  segmentProfileCount,
  selectedAttributeMatchType,
  selectedAttributeName,
  attributeBasedConditions,
  customAttributeBasedConditions,
  calculatingProfiles,
  segmentResultId,
  segmentError,
  parameterOptions,
  parameterOptionsInitial,
} from './state';
import { MatchType, ParameterType } from '@/enums/Segments';
import { ParameterOptionDto, SegmentInstanceDto } from '@/types/segmentservice';

export async function searchSegments(): Promise<void> {
  fetchingSegments.value = true;

  const { items, totalPages, total } = await segmentApiService.getSummary(segmentSearch);

  try {
    Object.assign(segments, items);
    setPagination(total as number, totalPages as number);

    fetchingSegments.value = false;
  } catch (error) {
    fetchingSegments.value = false;
    segmentError.value = error;
    throw error;
  }
}

export function resetSegments(): void {
  segments.splice(0, segments.length);
}

export function resetSegmentError(): void {
  segmentError.value = '';
}

export function resetSegmentSearch(): void {
  Object.assign(segmentSearch, segmentSearchStateInitial);
  currentSegment.value = null;
}

export function setPagination(items: number, pages: number): void {
  segmentPagination.totalItems = items;
  segmentPagination.totalPages = pages;
}

export async function fetchSegment(segmentId: string): Promise<void> {
  fetchingSegment.value = true;

  try {
    const data = await segmentApiService.getSegmentById(segmentId);
    const mappedData = await setSegmentBuilderData(data);

    currentSegment.value = mappedData;
    fetchingSegment.value = false;
  } catch (error) {
    fetchingSegment.value = false;
    segmentError.value = error;
    throw error;
  }
}

export async function saveSegment(segmentId: string, segment: Partial<SegmentInstanceDto>): Promise<void> {
  savingSegment.value = true;

  try {
    const payload = getSegmentBuilderPayload(segment);
    await segmentApiService.editSegmentById(segmentId, payload);
    savingSegment.value = false;
  } catch (error) {
    savingSegment.value = false;
    segmentError.value = error;
    throw error;
  }
}

export async function createSegment(segment: Partial<SegmentInstanceDto>): Promise<string> {
  savingSegment.value = true;

  try {
    const payload = getSegmentBuilderPayload(segment);
    const { id } = await segmentApiService.createSegment(payload);
    savingSegment.value = false;
    return id;
  } catch (error) {
    savingSegment.value = false;
    segmentError.value = error;
    throw error;
  }
}

export async function deleteSegment(segmentId: string): Promise<void> {
  deletingSegment.value = true;

  try {
    await segmentApiService.deleteSegmentById(segmentId);
    deletingSegment.value = false;
  } catch (error) {
    deletingSegment.value = false;
    segmentError.value = error;
    throw error;
  }
}

export async function fetchProfiles(): Promise<void> {
  fetchingProfiles.value = true;

  try {
    const {
      totalPages,
      total: totalItems,
      items: fetchedProfiles,
    } = await segmentApiService.getSegmentProfilesById(segmentResultId.value, profileSearch);

    profiles.splice(0, profiles.length, ...fetchedProfiles);

    Object.assign(profilePagination, {
      totalPages,
      totalItems,
    });

    fetchingProfiles.value = false;
  } catch (error) {
    fetchingProfiles.value = false;
    segmentError.value = error;
    throw error;
  }
}

export function resetProfiles(): void {
  segments.splice(0, profiles.length);
}

export function resetSegment(): void {
  currentSegment.value = null;
  segmentProfileCount.value = 0;
  segmentResultId.value = '';
}

export function resetProfileSearch(): void {
  Object.assign(profileSearch, profileSearchStateInitial);
}

export function setSelectedAttributeName(name: string) {
  selectedAttributeName.value = name;
}

export function setSelectedAttributeMatchType(type: MatchType) {
  selectedAttributeMatchType.value = type;
}

export async function fetchAvailableConditions(): Promise<void> {
  fetchingConditions.value = true;

  try {
    const response = await segmentApiService.getAvailableConditions();
    const { attributeBasedConditions: attributeConditions, customAttributeBasedConditions: customAttributeConditions } =
      response;

    Object.assign(attributeBasedConditions, attributeConditions);
    Object.assign(customAttributeBasedConditions, customAttributeConditions);

    fetchingConditions.value = false;
  } catch (error) {
    fetchingConditions.value = false;
    segmentError.value = error;
    throw error;
  }
}

export async function calculateProfiles(segmentId: string): Promise<void> {
  if (!segmentId) {
    return;
  }
  calculatingProfiles.value = true;

  try {
    const { id, audienceCount } = await segmentApiService.evaluateSegmentById(segmentId);
    segmentProfileCount.value = audienceCount;
    segmentResultId.value = id;
    calculatingProfiles.value = false;
  } catch (error) {
    calculatingProfiles.value = false;
    segmentError.value = error;
    throw error;
  }
}

export async function setParameterListOptions(parameterType: ParameterType): Promise<void> {
  let path = '';

  switch (parameterType) {
    case ParameterType.AchievementGroupId:
      path = '/api/v1/achievementgroups/search';
      break;
    case ParameterType.MembershipId:
      path = '/api/v1/admin/memberships/search';
      break;
    case ParameterType.StoreId:
      path = '/api/v1/admin/stores/search';
      break;
    case ParameterType.TagId:
      path = '/api/v1/admin/tags/search';
      break;
    case ParameterType.TagCategoryId:
      path = '/api/v1/admin/tagcategories/search';
      break;
    case ParameterType.CustomAttributeId:
      path = '/api/v1/admin/customattributes/search';
      break;
  }

  try {
    const { items } = await segmentApiService.getParameterListInstances(path);

    const options = items?.map(item => {
      return {
        label: item.name,
        value: item.id,
      };
    });

    parameterOptions.value[parameterType] = options as ParameterOptionDto[];
  } catch (error) {
    segmentError.value = error;
    throw error;
  }
}

export function resetParameterListOptions(): void {
  parameterOptions.value = {
    ...parameterOptionsInitial,
  };
}

export async function fetchParameterValueById(parameterType: ParameterType, parameterId: string): Promise<string> {
  let path = '';

  switch (parameterType) {
    case ParameterType.AchievementGroupId:
      path = `/api/v1/achievementgroups/${parameterId}`;
      break;
    case ParameterType.MembershipId:
      path = `/api/v1/admin/memberships/${parameterId}`;
      break;
    case ParameterType.StoreId:
      path = `/api/v1/admin/stores/search${parameterId}`;
      break;
    case ParameterType.TagId:
      path = `/api/v1/admin/tags/search${parameterId}`;
      break;
    case ParameterType.TagCategoryId:
      path = `/api/v1/admin/tagcategories/search${parameterId}`;
      break;
    case ParameterType.CustomAttributeId:
      path = `/api/v1/admin/customattributes/search${parameterId}`;
      break;
  }

  try {
    const { name } = await segmentApiService.getParameterDetails(path);

    return name;
  } catch (error) {
    segmentError.value = error;
    throw error;
  }
}

function getSegmentBuilderPayload(segment: Partial<SegmentInstanceDto>): Partial<SegmentInstanceDto> {
  const { name, description, conditionGroups } = segment;

  const payload: Partial<SegmentInstanceDto> = {
    name,
    description,
    conditionGroups: conditionGroups?.map(group => ({
      ...group,
      conditions: group.conditions?.map(condition => ({
        ...condition,
        parameters: condition.parameters?.map(parameter => ({
          order: parameter.order,
          value:
            parameter.type === ParameterType.Bool ? (parameter.value === true ? 'true' : 'false') : parameter.value,
        })),
      })),
    })),
  };

  return payload;
}

async function setSegmentBuilderData(segment: SegmentInstanceDto): Promise<SegmentInstanceDto> {
  const { conditionGroups, ...data } = segment;

  const mappedData: SegmentInstanceDto = {
    ...data,
    conditionGroups: await Promise.all(
      conditionGroups?.map(async group => ({
        ...group,
        conditions: await Promise.all(
          group.conditions?.map(async condition => ({
            ...condition,
            parameters: await Promise.all(
              condition.parameters?.map(async parameter => ({
                ...parameter,
                value:
                  parameter.type === ParameterType.Bool ? (parameter.value === 'true' ? true : false) : parameter.value,
                ...((parameter.type === ParameterType.AchievementGroupId ||
                  parameter.type === ParameterType.MembershipId ||
                  parameter.type === ParameterType.StoreId ||
                  parameter.type === ParameterType.TagCategoryId ||
                  parameter.type === ParameterType.TagId) && {
                  valueByID: await fetchParameterValueById(parameter.type, parameter.value),
                }),
              }))
            ),
          }))
        ),
      }))
    ),
  };

  return mappedData;
}
