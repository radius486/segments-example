import { AttributeCategory, DataSource, MatchType, ParameterType, UnionType } from '@/enums/Segments';

export interface SegmentDto {
  id: string;
  name: string | null;
  description: string | null;
  numberOfMembers: number | null;
  createdAt: Date;
  lastEvaluatedAt: Date;
  version: number;
}

export interface AttributeConditionDto {
  category: AttributeCategory | string;
  dataField: string;
  operator: MatchType | string;
  parameters: AttributeConditionParameterDto[];
}

export interface CustomAttributeBasedConditionsDto {
  category: AttributeCategory | string;
  customAttributeCategory: string | null;
  dataField: string;
  description: string | null;
  operator: MatchType | string;
  parameters: CustomAttributeConditionParameterDto[];
  placeholder: string | null;
}

export interface AvailableConditionsDto {
  attributeBasedConditions: AttributeConditionDto;
  customAttributeBasedConditions: CustomAttributeConditionParameterDto;
}

export interface AttributeConditionParameterDto {
  order: number;
  name: string;
  type: ParameterType;
}

export interface CustomAttributeConditionParameterDto {
  order: number;
  value: string;
  type: ParameterType;
}

export interface EmailDto {
  address: string | null;
  verified: boolean | null;
}

export interface SegmentProfileDto {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: EmailDto | null;
  createdUtc: Date;
}

export interface SegmentProfileResultsDto {
  pageNumber: number;
  totalPages: number;
  total: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  items: SegmentProfileDto[];
}

export interface AttributeDto {
  dataField: string;
  dataSource: DataSource;
  operator: string;
  category: string;
  parameters: AttributeParameter[];
  unionType: UnionType;
}

export interface CustomAttributeDto {
  dataField: string;
  dataSource: DataSource;
  operator: string;
  category: string;
  parameters: CustomAttributeParameter[];
  unionType: UnionType;
}

export interface AttributeParameter {
  order: number;
  name: string;
  value: any;
  type: ParameterType;
}

export interface CustomAttributeParameter {
  order: number;
  value: string;
  type: ParameterType;
}

export interface ConditionParameterDto {
  order: number;
  value: any;
  name?: string;
  type?: ParameterType;
  valueByID?: any;
}

export interface ConditionDto {
  dataSource: DataSource;
  category: AttributeCategory;
  dataField: string;
  operator: MatchType;
  parameters: ConditionParameterDto[];
  unionType: UnionType;
}

export interface ConditionGroupDto {
  conditions: ConditionDto[];
  unionType: UnionType;
}

export interface SegmentInstanceDto {
  id: string;
  name: string;
  description: string;
  conditionGroups: ConditionGroupDto[];
}

export interface SegmentInfoDto {
  id: string;
  segmentDefinitionVersion: number;
  segmentId: string;
  audienceCount: 0;
  createdUtc: Date;
}

export interface ParameterOptionDto {
  label: string;
  value: string;
}
