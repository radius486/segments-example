<template>
	<div class="border-top condition-card"
    :class="[ ...getCategoryBorderClasses, selected ? 'active' : '']"
    :style="{ pointerEvents: showActions ? 'auto' : 'none' }" >
		<div class="bg-lightgrey border border-cta-2-secondary" style="padding: 12px; border-radius: 0 0 6px 6px">
			<div class="d-flex flex-row justify-content-between">
				<div class="d-flex flex-row gap-2 align-items-center" style="max-width: 85%;">
          <i
            class="fas my-auto"
            :class="getCategoryColorClasses">
          </i>
					<span class="fw-medium text-lg text-truncate">{{ condition.dataField }}</span>
				</div>
        <div v-if="showActions" @click.stop>
          <el-dropdown trigger="click" size="large" placement="bottom-end">
            <span class="el-dropdown-link">
              <i class="fa-solid fa-ellipsis-vertical text-lg p-2 px-3"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="deleteItem">
                  <i class="fas fa-trash-can text-cta-2-primary text-sm me-3"></i>
                  {{ $t('segments.segment-builder.items.remove') }}
                </el-dropdown-item>
                <el-dropdown-item @click="duplicateItem">
                  <DocumentDuplicateIcon class="text-cta-2-primary text-sm me-3" style="height: 18px" />
                  {{ $t('segments.segment-builder.items.duplicate') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
			</div>
			<hr class="my-2 mt-0" />
      <!-- <pre>{{ condition }}</pre> -->
				<div class="d-flex flex-row justify-content-between gap-2 w-100">
          <div class="fw-bold text-truncate w-30">{{ $t(`segments.segment-builder.library.${condition.operator}`) }}</div>
          <div class="text-end w-70">
            <div v-if="condition.parameters?.some(parameter => parameter.value !== null)">
              <template v-for="parameter, index in filteredConditionParameters"
                :key="`parameter-${index}`">
                <span
                  v-if="index > 0 && condition.operator === MatchType.Between"
                  class="text-bold d-block">
                  {{ $t('segments.segment-builder.library.and') }}
                </span>
                <span
                  class="d-block text-truncate"
                  >
                  {{ parameter.valueByID || parameter.value }}
                </span>
                <span
                  v-if="parameter.type === ParameterType.StoreId"
                  class="text-bold d-block">
                  {{ $t('segments.segment-builder.library.is') }}
                </span>
              </template>
            </div>
            <span v-else>-/-</span>
          </div>
        </div>
		</div>
	</div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
	import { DocumentDuplicateIcon } from '@heroicons/vue/24/solid/index.js';
  import { ConditionDto } from '@/types/segmentservice';
  import { AttributeCategory, MatchType, ParameterType } from '@/enums/Segments';

  const props = withDefaults(defineProps<{
    condition: ConditionDto;
    conditionIndex: number;
    selected: boolean;
    showActions: boolean;
  }>(), {
    selected: false
  });

  const emit = defineEmits<{
    (e: 'duplicateItem', conditionIndex: number): void;
    (e: 'deleteItem', conditionIndex: number): void;
  }>();

  const duplicateItem = () => {
    emit('duplicateItem', props.conditionIndex);
  };

  const deleteItem = () => {
    emit('deleteItem', props.conditionIndex);
  };

  const getCategoryColorClasses = computed(() => {
    return [
      props.condition.category === AttributeCategory.Transaction ? 'fa-shopping-cart text-join-transactions' : '',
      props.condition.category === AttributeCategory.Member ? 'fa-users text-join-members' : '',
      props.condition.category === AttributeCategory.Achievement ? 'fa-trophy text-join-achievements' : '',
      props.condition.category === AttributeCategory.Reward ? 'fa-gift text-join-rewards' : '',
    ];
  });

  const getCategoryBorderClasses = computed(() => {
    return [
      props.condition.category === AttributeCategory.Transaction ? 'border-join-transactions' : '',
      props.condition.category === AttributeCategory.Member ? 'border-join-members' : '',
      props.condition.category === AttributeCategory.Achievement ? 'border-join-achievements' : '',
      props.condition.category === AttributeCategory.Reward ? 'border-join-rewards' : '',
    ];
  });

  const filteredConditionParameters = computed(() => {
    return props.condition.parameters.filter(parameter => parameter.type !== ParameterType.CustomAttributeId);
  });
</script>

<style scoped>
	.condition-card {
		border-top-width: 1px;
		margin-top: 3px;
	}
	.condition-card:hover {
		margin-top: 0px;
		cursor: pointer;
		border-top-width: 2px !important;
		transition: all 0.3s ease-in-out;
	}
	.condition-card:active,
	.condition-card.active {
		cursor: grabbing;
		margin-top: 0px;
		border-top-width: 4px !important;
	}
</style>
