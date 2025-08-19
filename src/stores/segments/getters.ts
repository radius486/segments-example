import { computed } from 'vue';

import {
  segments,
  currentSegment,
  profiles,
  attributeBasedConditions,
  customAttributeBasedConditions,
  selectedAttributeMatchType,
  selectedAttributeName,
} from './state';

import { AttributeCategory, DataSource, ParameterType, UnionType } from '@/enums/Segments';

import {
  AttributeDto,
  AttributeParameter,
  AttributeConditionDto,
  CustomAttributeBasedConditionsDto,
  ConditionGroupDto,
  CustomAttributeDto,
  SegmentDto,
  SegmentProfileDto,
  CustomAttributeConditionParameterDto,
  AttributeConditionParameterDto,
} from '@/types/segmentservice/dto';

export const getSegments = computed(() => {
  return segments.map((segment: SegmentDto) => segment);
});

export const getConditionGroups = computed((): ConditionGroupDto[] => {
  return currentSegment.value?.conditionGroups.map(group => group) || [];
});

export const getProfiles = computed(() => {
  return profiles.map((profile: SegmentProfileDto) => profile);
});

export const getSelectedAttributeParameters = computed((): AttributeParameter[] => {
  const parameters = attributeBasedConditions.find(
    condition =>
      condition.dataField === selectedAttributeName.value && condition.operator === selectedAttributeMatchType.value
  )?.parameters || [{ type: ParameterType.Bool, name: 'value', order: 0 }];

  return parameters.map(parameter => {
    return {
      ...parameter,
      value: parameter.type === ParameterType.Bool ? false : null,
    };
  });
});

export const getAvailableMatchTypes = computed((): string[] => {
  return (
    attributeBasedConditions
      .filter((condition: AttributeConditionDto) => condition.dataField === selectedAttributeName.value)
      .map((condition: AttributeConditionDto) => condition.operator) || []
  );
});

export const getAttributeLibrary = computed((): Record<AttributeCategory, AttributeDto[] | CustomAttributeDto[]> => {
  const attributeLibrary: Record<AttributeCategory, AttributeDto[]> = {
    [AttributeCategory.Transaction]: [],
    [AttributeCategory.Member]: [],
    [AttributeCategory.Reward]: [],
    [AttributeCategory.Achievement]: [],
  };

  attributeBasedConditions.forEach((attribute: AttributeConditionDto) => {
    const category = attribute.category as AttributeCategory;

    if (!attributeLibrary[category]?.find((item: AttributeDto) => item.dataField === attribute.dataField)) {
      const libraryItem: AttributeDto = {
        dataField: attribute.dataField,
        dataSource: DataSource.AttributeBasedCondition,
        operator: attribute.operator,
        category: attribute.category,
        unionType: UnionType.Undefined,
        parameters: attribute.parameters?.length
          ? attribute.parameters?.map((parameter: AttributeConditionParameterDto) => {
              return {
                order: parameter.order,
                name: parameter.name,
                type: parameter.type,
                value: null,
              };
            })
          : [],
      };
      attributeLibrary[category].push(libraryItem);
    }
  });

  return attributeLibrary;
});

export const getCustomAttributeLibrary = computed((): CustomAttributeDto[] => {
  const customAttributeLibrary: CustomAttributeDto[] = [];

  customAttributeBasedConditions.forEach((attribute: CustomAttributeBasedConditionsDto) => {
    if (!customAttributeLibrary.find((item: CustomAttributeDto) => item.dataField === attribute.dataField)) {
      const libraryItem: CustomAttributeDto = {
        dataField: attribute.dataField,
        dataSource: DataSource.CustomAttributeBasedCondition,
        operator: attribute.operator,
        category: attribute.category,
        unionType: UnionType.Undefined,
        parameters: attribute.parameters?.length
          ? attribute.parameters?.map((parameter: CustomAttributeConditionParameterDto) => {
              return {
                order: parameter.order,
                type: parameter.type,
                value: parameter.value,
              };
            })
          : [],
      };

      customAttributeLibrary.push(libraryItem);
    }
  });

  return customAttributeLibrary;
});

export const getSegmentName = computed((): string => {
  return currentSegment.value?.name || '';
});

export const getSegmentDescription = computed((): string => {
  return currentSegment.value?.description || '';
});
