import { ref, reactive } from 'vue';
import {
  SegmentSearch,
  SegmentDto,
  SegmentProfileDto,
  AttributeConditionDto,
  SegmentInstanceDto,
  SegmentProfilesPagination,
  ProfileSearch,
  ParameterOptionDto,
} from '@/types/segmentservice';
import { MatchType, ParameterType } from '@/enums/Segments';
import { AchievementStatus, Gender, MemberStatus, RewardStatus, StoreRelationType } from '@/enums';

export const segmentSearchStateInitial: SegmentSearch = {
  page: 1,
  pageSize: 5,
  sortColumn: 'CreatedUtc',
  descending: true,
  searchString: null,
};

export const profileSearchStateInitial: SegmentSearch = {
  page: 1,
  pageSize: 10,
  sortColumn: 'CreatedUtc',
  descending: true,
  searchString: null,
};

export const parameterOptionsInitial: Record<string, ParameterOptionDto[]> = {
  [ParameterType.MemberGender]: [
    {
      label: Gender.Female,
      value: Gender.Female,
    },
    {
      label: Gender.Male,
      value: Gender.Male,
    },
    {
      label: Gender.Unknown,
      value: Gender.Unknown,
    },
  ],
  [ParameterType.MemberStatus]: [
    {
      label: MemberStatus.Inactive,
      value: MemberStatus.Inactive,
    },
    {
      label: MemberStatus.Active,
      value: MemberStatus.Active,
    },
    {
      label: MemberStatus.Closed,
      value: MemberStatus.Closed,
    },
  ],
  [ParameterType.AchievementStatus]: [
    {
      label: AchievementStatus.Active,
      value: AchievementStatus.Active,
    },
    {
      label: AchievementStatus.Expired,
      value: AchievementStatus.Expired,
    },
    {
      label: AchievementStatus.Cancelled,
      value: AchievementStatus.Cancelled,
    },
    {
      label: AchievementStatus.Draft,
      value: AchievementStatus.Draft,
    },
  ],
  [ParameterType.StoreRelationType]: [
    {
      label: StoreRelationType.Preferred,
      value: StoreRelationType.Preferred,
    },
    {
      label: StoreRelationType.Entry,
      value: StoreRelationType.Entry,
    },
  ],
  [ParameterType.RewardStatus]: [
    {
      label: RewardStatus.Active,
      value: RewardStatus.Active,
    },
    {
      label: RewardStatus.Expired,
      value: RewardStatus.Expired,
    },
    {
      label: RewardStatus.Cancelled,
      value: RewardStatus.Cancelled,
    },
    {
      label: RewardStatus.Draft,
      value: RewardStatus.Draft,
    },
  ],
};

export const fetchingSegments = ref<boolean>(false);

export const fetchingSegment = ref<boolean>(false);

export const savingSegment = ref<boolean>(false);

export const deletingSegment = ref<boolean>(false);

export const calculatingProfiles = ref<boolean>(false);

export const fetchingProfiles = ref<boolean>(false);

export const fetchingConditions = ref<boolean>(false);

export const currentSegment = ref<SegmentInstanceDto | null>();

export const segments = reactive<SegmentDto[]>([]);

export const profiles = reactive<SegmentProfileDto[]>([]);

export const segmentPagination = reactive({
  totalItems: 0,
  totalPages: 0,
});

export const profilePagination = reactive<SegmentProfilesPagination>({
  totalItems: 0,
  totalPages: 0,
});

export const segmentSearch = reactive<SegmentSearch>({
  ...segmentSearchStateInitial,
});

export const profileSearch = reactive<ProfileSearch>({
  ...profileSearchStateInitial,
});

export const totalPages = ref<number>(0);

export const totalItems = ref<number>(0);

export const segmentProfileCount = ref<number>(0);

export const segmentResultId = ref<string>('');

export const selectedAttributeName = ref<string>('');

export const selectedAttributeMatchType = ref<MatchType>();

export const attributeBasedConditions = reactive<AttributeConditionDto[]>([]);

export const customAttributeBasedConditions = reactive([]);

export const segmentError = ref<any>('');

export const parameterOptions = ref<Record<string, ParameterOptionDto[]>>({
  ...parameterOptionsInitial,
});
