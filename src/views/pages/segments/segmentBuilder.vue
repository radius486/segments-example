<template>
  <div class="segment-builder">
    <div class="container-fluid">
      <div class="row mt-5 mb-3">
        <loading
          v-if="segmentId && fetchingSegment"
          v-model:active="fetchingSegment"
          :opacity="1"
          :is-full-page="false"
          :height="40"
          transition="none"
        ></loading>
        <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <div class="d-flex flex-column gap-2">
            <div class="segment-name d-flex flex-row gap-3 align-items-center">
              <h1
                v-if="!editName"
                class="segment-name-title text-dark m-0 text-truncate"
                style="cursor: pointer; font-size: 32px"
                @click="startEditing"
              >
                {{ segment.name }}
              </h1>
              <el-input
                v-else
                v-model="tempName"
                class="input-group"
                size="small"
                style="width: 240px"
                @keydown.enter="saveName"
              />
              <i
                v-if="!editName"
                class="fas fa-pen text-dark pb-1"
                style="font-size: 18px; cursor: pointer"
                @click="startEditing"
              ></i>
              <div v-else class="d-flex flex-rows">
                <el-button class="bg-cta-1-primary text-white" @click="saveName">
                  <i class="fas fa-check me-2" style="font-size: 14px"></i>
                  {{ $t('segments.segment-builder.btn-rename') }}
                </el-button>
                <el-button class="text-cta-2-primary" @click="cancelEdit">
                  <i class="fas fa-xmark me-2" style="font-size: 14px"></i>
                  {{ $t('segments.segment-builder.btn-cancel') }}
                </el-button>
              </div>
            </div>
            <div class="d-flex flex-row gap-2 align-items-center">
              <el-button
                class="btn d-flex shadow-none text-white fw-normal border border-cta-2-secondary px-2 py-1 m-0 me-1"
                circle
                size="small"
                @click="calculate"
              >
                <i
                  class="fas fa-arrows-rotate text-xs text-cta-2-primary"
                  :class="{ 'spin-animation': calculatingProfiles }"
                >
                </i>
              </el-button>
              <el-tooltip
                effect="light"
                :content="$t('segments.segment-builder.segmented-profiles-tooltip')"
                placement="top"
              >
                <span class="text-sm"
                  >{{ $t('segments.segment-builder.segmented-profiles') }}: {{ segmentProfileCount }}
                </span>
              </el-tooltip>
              <IdWrapper v-if="segmentId" :id="segmentId" />
            </div>
          </div>
          <div class="d-flex flex-wrap gap-3">
            <el-button
              v-if="segmentId"
              dark
              size="large"
              style="width: 190px; height: 44px"
              rounded
              class="bg-loyalty-danger text-white text-capitalize fw-normal float-end text-md mx-0"
              @click="openDeleteConfirmation"
            >
              <i v-if="!deletingSegment" class="fas fa-trash text-white mx-2 my-auto"></i>
              <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {{ $t('segments.btn-segment-delete') }}
            </el-button>
            <el-button
              dark
              size="large"
              style="width: 178px; height: 44px"
              rounded
              class="btn-loyalty-primary text-white text-capitalize fw-normal float-end text-md mx-0"
              @click="save(true)"
            >
              <i v-if="!savingSegment" class="fas fa-bookmark text-white mx-2 my-auto"></i>
              <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {{ $t('segments.segment-builder.btn-save') }}
            </el-button>
            <el-button
              dark
              size="large"
              style="width: 178px; height: 44px"
              rounded
              class="btn-default text-white text-capitalize fw-normal float-end text-md mx-0"
              @click="goBack"
            >
              <i class="fas fa-x text-white mx-2"></i>
              {{ $t('segments.segment-builder.btn-cancel') }}
            </el-button>
          </div>
        </div>
      </div>
      <p>{{ segment.description }}</p>
      <itemGroup
        v-for="(group, groupIndex) in segment.conditionGroups"
        :key="`item-group-${groupIndex}`"
        :group="group"
        :groupIndex="groupIndex"
        :groupsLength="segment.conditionGroups?.length as number"
        :isDragging="isDragging"
        :selectedItem="selectedItem"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
        @select="selectItem"
        @duplicate-item="duplicateItem"
        @delete-item="deleteItem"
        @remove-group="removeGroup"
        @duplicate-group="duplicateGroup"
      />

      <!-- <pre>{{ segment }}</pre> -->

      <div class="d-flex flex-row justify-content-center">
        <button
          class="orderButton bg-transparent shadow-none d-flex flex-row align-items-center gap-2 border-0 fw-medium text-sm mt-3 text-cta-2-primary"
          @click="addGroup"
        >
          <i class="fas fa-circle-plus text-cta-1-primary"></i>
          {{ $t('segments.segment-builder.btn-add-group') }}
        </button>
      </div>
    </div>

    <itemLibrary
      v-show="!selectedItem"
      @rename="editName = true"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @clone="onCloneItem"
    >
    </itemLibrary>
    <itemSettings
      v-if="selectedItem"
      :condition="selectedItem"
      :groupIndex="selectedGroupIndex"
      :conditionIndex="selectedConditionIndex"
      @back-to-library="selectedItem = null"
      @calculate="calculate"
      @rename="editName = true"
      @delete="deleteItem"
    >
    </itemSettings>
    <ConfirmationDialog
      v-model="deleteConfirmation"
      :item-name="segment.name"
      :title="$t('segments.segment-builder.delete-confirmation.title')"
      :body-text="$t('segments.segment-builder.delete-confirmation.body')"
      :confirmation-text="$t('segments.segment-builder.delete-confirmation.confirmation')"
      :btn-confirm-text="$t('segments.segment-builder.delete-confirmation.confirm')"
      :btn-cancel-text="$t('segments.segment-builder.delete-confirmation.decline')"
      @confirm="removeSegment"
      @cancel="deleteConfirmation = false"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import Loading from 'vue-loading-overlay';
  import itemLibrary from './components/itemLibrary.vue';
  import itemSettings from './components/itemSettings.vue';
  import itemGroup from './components/itemGroup.vue';
  import IdWrapper from '@/components/IdWrapper.vue';
  import { ConditionDto, ConditionGroupDto, SegmentInstanceDto } from '@/types/segmentservice';
  import { UnionType } from '@/enums/Segments';
  import { useSegmentsStore } from '@/stores/segments';
  import useErrorHandler from '@/composables/useErrorHandler.js';

  const route = useRoute();
  const router = useRouter();
  const { handleError } = useErrorHandler();
  const segmentsStore = useSegmentsStore();

  const {
    fetchAvailableConditions,
    fetchSegment,
    resetSegment,
    saveSegment,
    createSegment,
    deleteSegment,
    calculateProfiles,
    resetSegmentError,
  } = segmentsStore;

  const {
    fetchingSegment,
    savingSegment,
    deletingSegment,
    calculatingProfiles,
    getSegmentName,
    getSegmentDescription,
    getConditionGroups,
    segmentProfileCount,
    segmentError,
  } = storeToRefs(segmentsStore);

  const { id }: { id?: string } = route.params;
  const segmentId = ref<string>(id ? id : '');
  const segment = ref<Partial<SegmentInstanceDto>>({
    name: 'Segment name',
    description: '',
    conditionGroups: [],
  });
  const editName = ref(false);
  const tempName = ref(segment.value.name);
  const deleteConfirmation = ref<boolean>(false);

  const startEditing = () => {
    if (editName.value) return;
    editName.value = true;
    tempName.value = segment.value.name;
  };

  const cancelEdit = () => {
    editName.value = false;
  };

  const saveName = () => {
    segment.value.name = tempName.value;
    editName.value = false;
  };

  const save = async (shouldGoBack: boolean = false): Promise<void> => {
    if (!segment.value.name) {
      return;
    }
    let createdSegmentId = '';

    if (segmentId.value) {
      await saveSegment(segmentId.value, segment.value);
    } else {
      createdSegmentId = await createSegment(segment.value);
      segmentId.value = !shouldGoBack ? createdSegmentId : '';
    }

    if (shouldGoBack) {
      await calculateProfiles(segmentId.value || createdSegmentId);
      goBack();
    }
  };

  const openDeleteConfirmation = (): void => {
    if (!segmentId.value) {
      return;
    }

    deleteConfirmation.value = true;
  };

  const removeSegment = async (): Promise<void> => {
    try {
      await deleteSegment(segmentId.value as string);
      router.push({ name: 'Segments' });
    } catch (err) {
      handleError(err);
      deleteConfirmation.value = false;
    }
  };

  const selectedItem = ref<ConditionDto | null>(null);
  const selectedGroupIndex = ref<number | null>(null);
  const selectedConditionIndex = ref<number | null>(null);

  const isDragging = ref<boolean>(false);

  const onDragStart = (): void => {
    isDragging.value = true;
  };

  const onDragEnd = (): void => {
    segment.value.conditionGroups?.forEach((group: ConditionGroupDto): void => {
      checkGroupConditionUnionType(group);
    });

    isDragging.value = false;
  };

  const onCloneItem = (): void => {
    isDragging.value = false;
  };

  const selectItem = (item: ConditionDto, groupIndex: number, conditionIndex: number): void => {
    selectedItem.value = item;
    selectedGroupIndex.value = groupIndex;
    selectedConditionIndex.value = conditionIndex;
  };

  const duplicateItem = (groupIndex: number, conditionIndex: number) => {
    if (!segment.value.conditionGroups?.length) {
      return;
    }

    const group = segment.value.conditionGroups[groupIndex];
    const item = group.conditions[conditionIndex];
    const newItem = JSON.parse(JSON.stringify(item));
    group.conditions.splice(conditionIndex + 1, 0, newItem);
    checkGroupConditionUnionType(group);
  };

  const deleteItem = (groupIndex: number, conditionIndex: number) => {
    if (!segment.value.conditionGroups?.length) {
      return;
    }

    const group = segment.value.conditionGroups[groupIndex];

    if (selectedItem.value === group.conditions[conditionIndex]) {
      selectedItem.value = null;
    }

    group.conditions.splice(conditionIndex, 1);
    checkGroupConditionUnionType(group);
  };

  const calculate = async (): Promise<void> => {
    await save();
    calculateProfiles(segmentId.value as string);
  };

  const addGroup = (): void => {
    const newGroup: ConditionGroupDto = {
      conditions: [],
      unionType: UnionType.Undefined,
    };

    const groups = segment.value.conditionGroups;

    if (!groups) {
      return;
    }

    groups.push(newGroup);
    checkGroupUnionType();
  };

  const removeGroup = (groupIndex: number) => {
    const groups = segment.value.conditionGroups;

    if (!groups?.length) {
      return;
    }

    if (selectedGroupIndex.value === groupIndex) {
      selectedItem.value = null;
    }

    groups.splice(groupIndex, 1);

    if (groups.length === 0) {
      addGroup();
    }

    groups[groups.length - 1].unionType = UnionType.Undefined;
  };

  const duplicateGroup = (groupIndex: number) => {
    const groups = segment.value.conditionGroups || [];

    if (!groups.length) {
      return;
    }

    const group = groups[groupIndex];
    const newGroup: ConditionGroupDto = JSON.parse(JSON.stringify(group));
    groups.splice(groupIndex + 1, 0, newGroup);
    checkGroupUnionType();
  };

  const setSegment = (): void => {
    segment.value.name = getSegmentName.value;
    segment.value.description = getSegmentDescription.value;
    segment.value.conditionGroups = getConditionGroups.value;
  };

  const checkGroupUnionType = (): void => {
    const { conditionGroups: groups } = segment.value;

    if (!groups?.length) {
      return;
    }

    groups.forEach((group, index) => {
      if (index === groups.length - 1) {
        group.unionType = UnionType.Undefined;
        return;
      }

      if (group.unionType === UnionType.Undefined) {
        group.unionType = UnionType.Or;
      }
    });
  };

  const checkGroupConditionUnionType = (group: ConditionGroupDto): void => {
    const { conditions } = group;

    if (!conditions.length) {
      return;
    }

    conditions.forEach((condition, index) => {
      if (index === conditions.length - 1) {
        condition.unionType = UnionType.Undefined;
        return;
      }

      if (condition.unionType === UnionType.Undefined) {
        condition.unionType = UnionType.Or;
      }
    });
  };

  const goBack = (): void => {
    if (router.options.history.state.back) {
      router.back();
    } else {
      router.push({ name: 'Segments' });
    }
  };

  watch(
    () => segmentError.value,
    err => {
      if (err) {
        handleError(err);
      }
    }
  );

  onMounted(async () => {
    if (segmentId.value) {
      await fetchSegment(segmentId.value);
      setSegment();
      calculateProfiles(segmentId.value);
    }
    fetchAvailableConditions();
    if (segment.value.conditionGroups?.length === 0) {
      addGroup();
    }
  });

  onUnmounted(() => {
    resetSegment();
    resetSegmentError();
  });
</script>

<style scoped>
  .container-fluid {
    padding-bottom: 400px;
  }

  .segment-name,
  .segment-name-title {
    transition: all 0.3s ease-in-out;
  }

  .segment-name:hover {
    color: #0b4f4a;
  }

  .segment-name-title:hover {
    transform: translateY(-2px);
    color: #0b4f4a;
  }
</style>
