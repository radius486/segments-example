<template>
	<div class="fixed-bottom">
		<button class="btn-back-to-library w-100 p-1 px-3 border-0 text-end" @click="backToLibrary">
			<i class="fas fa-arrow-left px-2"></i>
			{{ $t('segments.segment-builder.item-settings.back-to-library') }}
		</button>
		<nav
			:class="[
        ...getCategoryBorderClasses,
        ...(isMinimized ? 'minimized' : ''),
      ]"
			class="bg-white border-top d-flex flex-column justify-content-start pt-3 ps-8 pe-4">
			<div class="d-flex flex-row justify-content-between border-bottom border-cta-2-secondary mb-3">
				<div
					class="d-flex flex-row gap-3 align-items-center text-nowrap pb-2 text-capitalize"
					:class="{ 'w-100': isMinimized }"
					@click="isMinimized ? toggleMinimize() : ''">
					<h4 v-if="!isMinimized">{{ $t('segments.segment-builder.library.attribute-properties') }}</h4>
					<h5 v-else>{{ $t('segments.segment-builder.library.attribute-properties') }}</h5>
				</div>
				<el-dropdown trigger="click" size="large" placement="top-end">
					<span class="el-dropdown-link">
						<i class="fa-solid fa-ellipsis-vertical text-lg p-2 px-3"></i>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item v-if="isMinimized" @click="toggleMinimize">
								<i class="fas fa-window-maximize text-cta-2-primary text-sm me-3"></i>
								{{ $t('segments.segment-builder.library.maximize-dock') }}
							</el-dropdown-item>
							<el-dropdown-item v-else @click="toggleMinimize">
								<i class="fas fa-window-minimize text-cta-2-primary text-sm me-3"></i>
								{{ $t('segments.segment-builder.library.minimize-dock') }}
							</el-dropdown-item>
							<el-dropdown-item @click="rename">
								<i class="fas fa-edit text-cta-2-primary text-sm me-3"></i>
								{{ $t('segments.segment-builder.library.rename-segment') }}
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
			<div v-if="!isMinimized" class="d-flex flex-column justify-content-between h-100">
				<div class="row">
          <div class="col-lg-12 mb-3 d-flex gap-3 align-items-center justify-content-start">
            <div
              style="min-width: 150px; line-height: 20px;"
              class="d-flex flex-shrink-0 flex-row justify-content-between align-items-center rounded-3 bg-lightgrey border border-cta-2-secondary text-md fw-bold px-3 py-2 gap-3 text-nowrap">
              <i
                class="fas my-auto text-sm"
                :class="getCategoryIconClasses">
              </i>
              <span>{{ condition.dataField }}</span>
              <span class="for-alignment"></span>
            </div>
            <el-select
              v-if="condition.operator"
              v-model="condition.operator"
              style="min-width: 150px;"
              size="large"
              class="text-truncate text-end w-auto text-bold"
              placeholder="Match type"
              :disabled="getAvailableMatchTypes.length <= 1 ? true : false"
              @click.stop
              @change="changeMatchType"
            >
              <el-option
                v-for="type, index in getAvailableMatchTypes"
                :key="`match-type-${index}`"
                :label="$t(`segments.segment-builder.library.${type}`)"
                :value="type"
              />
            </el-select>
            <div class="d-flex gap-3 align-items-center">
              <template
                v-for="parameter, index in condition.parameters"
                :key="`parameter-${index}`">
                <span
                  v-if="index > 0 && condition.operator === MatchType.Between"
                  class="text-bold">
                  {{ $t('segments.segment-builder.library.and') }}
                </span>
                <el-input
                  v-if="
                    parameter.type === ParameterType.Text ||
                    parameter.type === ParameterType.Guid ||
                    parameter.type === ParameterType.Number ||
                    parameter.type === ParameterType.CustomAttributeValue
                  "
                  v-model="parameter.value"
                  class="text-truncate text-end w-auto"
                  style="min-width: 375px;"
                  size="large"
                  :name="parameter.name"
                  maxlength="255"
                  :type="(
                    parameter.type === ParameterType.Text ||
                    parameter.type === ParameterType.Guid ||
                    parameter.type === ParameterType.CustomAttributeValue
                  ) ? 'text'
                    : 'number'"
                  :placeholder="parameter.name"
                />
                <el-date-picker
                  v-if="parameter.type === ParameterType.Date || parameter.type === ParameterType.DateTime"
                  v-model="parameter.value"
                  :type="parameter.type === ParameterType.Date ? 'date' : 'datetime'"
                  :placeholder="parameter.name"
                  :format="parameter.type === ParameterType.Date ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
                  :value-format="parameter.type === ParameterType.Date ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm:ss.000Z'"
                  size="large"
                />
                <el-switch
                  v-if="parameter.type === ParameterType.Bool"
                  v-model="parameter.value"
                  size="large"
                />
                <el-select
                  v-if="
                    parameter.type === ParameterType.AchievementGroupId ||
                    parameter.type === ParameterType.AchievementStatus ||
                    parameter.type === ParameterType.MemberGender ||
                    parameter.type === ParameterType.MemberStatus ||
                    parameter.type === ParameterType.MembershipId ||
                    parameter.type === ParameterType.RewardStatus ||
                    parameter.type === ParameterType.StoreRelationType ||
                    parameter.type === ParameterType.StoreId ||
                    parameter.type === ParameterType.TagCategoryId ||
                    parameter.type === ParameterType.TagId
                  "
                  v-model="parameter.value"
                  style="min-width: 150px;"
                  size="large"
                  class="text-truncate text-end w-auto text-bold"
                  :placeholder="parameter.name"
                  @click.stop
                  @change="(id: string) => setParameterValueById(parameter, id)"
                >
                  <el-option
                    v-for="option, index in parameterOptions[parameter.type]"
                    :key="`option-${index}`"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                <span
                  v-if="parameter.type === ParameterType.StoreId"
                  class="mx-3 text-bold">
                  {{ $t('segments.segment-builder.library.is') }}
                </span>
              </template>
            </div>
            <!-- <pre>{{ getSelectedAttributeParameters }}</pre> -->
          </div>
				</div>
				<div class="d-flex flex-row justify-content-between">
					<button
						class="btn btn-transparent px-0 shadow-none text-cta-2-primary fw-medium m-0"
						@click="deleteItem">
						<i class="fas fa-trash-can text-sm me-2"></i>
						{{ $t('segments.segment-builder.item-settings.btn-delete') }}
					</button>
				</div>
			</div>
		</nav>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, watch, nextTick, onUnmounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { ConditionDto, ConditionParameterDto } from '@/types/segmentservice';
  import { AttributeCategory, MatchType, ParameterType } from '@/enums/Segments';
  import { useSegmentsStore } from '@/stores/segments';
  import useErrorHandler from '@/composables/useErrorHandler';

  const props = defineProps<{
    condition: ConditionDto;
    groupIndex: number | null;
    conditionIndex: number | null;
  }>();
  const emit = defineEmits<{
    (e: 'backToLibrary'): void;
    (e: 'rename'): void;
    (e: 'delete', groupIndex: number, conditionIndex: number): void;
    (e: 'calculate'): void;
  }>();
  const { handleError } = useErrorHandler();
  const segmentsStore = useSegmentsStore();

  const {
    setSelectedAttributeName,
    setSelectedAttributeMatchType,
    setParameterListOptions,
    resetParameterListOptions,
  } = segmentsStore;

  const {
    getSelectedAttributeParameters,
    getAvailableMatchTypes,
    segmentProfileCount,
    calculatingProfiles,
    parameterOptions,
    segmentError,
  } = storeToRefs(segmentsStore);

  const backToLibrary = () => {
    emit('backToLibrary');
  };

  const rename = () => {
    console.log('Rename segment');
    emit('rename');
  };

  const isMinimized = ref(false);
  const toggleMinimize = () => {
    isMinimized.value = !isMinimized.value;
  };

  const deleteItem = () => {
    if (!props.groupIndex === null || !props.conditionIndex === null) return;

    emit('delete',props.groupIndex as number, props.conditionIndex as number);
    backToLibrary();
  };

  const calculateProfiles = () => {
    emit('calculate');
  };

  const changeMatchType = (value: MatchType) => {
    props.condition.operator = value;
    nextTick(() => {
      setAttributeParameters();
    });
  };

  const getCategoryBorderClasses = computed(() => {
    return [
      props.condition.category === AttributeCategory.Transaction ? 'border-join-transactions' : '',
      props.condition.category === AttributeCategory.Member ? 'border-join-members' : '',
      props.condition.category === AttributeCategory.Achievement ? 'border-join-achievements' : '',
      props.condition.category === AttributeCategory.Reward ? 'border-join-rewards' : '',
    ];
  });

  const getCategoryIconClasses = computed(() => {
    return [
      props.condition.category === AttributeCategory.Transaction ? 'fa-shopping-cart text-join-transactions' : '',
      props.condition.category === AttributeCategory.Member ? 'fa-users text-join-members' : '',
      props.condition.category === AttributeCategory.Achievement ? 'fa-trophy text-join-achievements' : '',
      props.condition.category === AttributeCategory.Reward ? 'fa-gift text-join-rewards' : '',
    ];
  });

  const setAttributeParameters = () => {
    props.condition.parameters = getSelectedAttributeParameters.value as ConditionParameterDto[];
  }

  const setParameterValueById = (parameter: ConditionParameterDto, id: string) => {
    const { type } = parameter;
    if (!type) return;
    const parameterOption = parameterOptions.value[type]
      .find((option) => option.value === id);

    if (!parameterOption) return;
    parameter.valueByID = parameterOption.label;
  }

  watch(() => props.condition, (condition) => {
    condition.parameters.forEach((parameter) => {
      if (
        parameter.type === ParameterType.AchievementGroupId ||
        parameter.type === ParameterType.MembershipId ||
        parameter.type === ParameterType.StoreId ||
        parameter.type === ParameterType.TagCategoryId ||
        parameter.type === ParameterType.TagId
      ) {
        if (!parameterOptions.value[parameter.type]?.length) {
          setParameterListOptions(parameter.type);
        }
      }
    });
  }, { immediate: true });

  watch(() => props.condition.dataField, (title) => {
    setSelectedAttributeName(title as string);
  }, { immediate: true });

  watch(() => props.condition.operator, (type) => {
    setSelectedAttributeMatchType(type as MatchType);
  }, { immediate: true });

  watch(() => segmentError.value, (err) => {
    if (err) {
      handleError(err);
    }
  });

  onUnmounted(() => {
    resetParameterListOptions();
  });
</script>

<style scoped>
	nav {
		height: 400px;
		border-top-width: 2px !important;
		transition: all 0.3s ease-in-out;
	}

	nav.minimized {
		height: fit-content;
	}

	.btn-back-to-library {
		background-color: #ebebeb;
		transition: all 0.3s ease-in-out;
	}

	.btn-back-to-library:hover {
		background-color: #d9d9d9;
		color: #000000;
	}

	.btn-back-to-library:hover i {
		transition: all 0.2s ease-in-out;
	}

	.btn-back-to-library:hover i {
		transform: translateX(-4px);
	}
</style>
