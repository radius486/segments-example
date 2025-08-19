<template>
  <div class="group pt-3 d-flex flex-column gap-2">
    <span class="fw-medium">{{ $t("segments.segment-builder.group") }} {{ groupIndex + 1 }}</span>
    <div
      class="card d-flex flex-column">
      <div
        class="d-flex flex-row gap-1 justify-content-end align-items-top pt-2 px-2">
        <button
          class="bg-transparent border-0 d-flex"
          @click="duplicateGroup"
        >
          <DocumentDuplicateIcon
            class="text-cta-2-primary"
            style="height: 18px"></DocumentDuplicateIcon>
        </button>
        <button
          class="bg-transparent border-0 d-flex"
          @click="removeGroup"
        >
          <XMarkIcon class="text-cta-2-primary" style="height: 20px"></XMarkIcon>
        </button>
      </div>
      <draggable
        v-model="group.conditions"
        class="draggable d-flex gap-3 w-100 ps-4 pb-4 flex-wrap"
        group="items"
        itemKey="id"
        :animation="300"
        @start="onDragStart"
        @end="onDragEnd">
        <template #item="{ element: condition, index: conditionIndex }">
          <div class="mb-2 d-flex gap-3">
            <conditionCard
              :conditionIndex="conditionIndex"
              style="width: 300px"
              class="flex-shrink-0"
              :condition="condition"
              :showActions="true"
              :selected="selectedItem === condition"
              @click="selectItem(condition, conditionIndex)"
              @duplicate-item="duplicateItem"
              @delete-item="deleteItem" />
            <div v-if="conditionIndex < group.conditions.length - 1" class="mx-2 flex-shrink-0">
              <operatorSelector
                v-model:operator="group.conditions[conditionIndex].unionType"
                class="mt-1"
                size="medium"
              />
            </div>
          </div>
        </template>
        <template #footer>
          <div
            v-if="group.conditions.length < 3"
            :style="{ marginRight: isDragging ? '-212px' : '0px' }"
            class="drop-zone border-cta-2-secondary d-flex justify-content-center align-items-center mb-1">
            <span class="text-sm">{{ $t("segments.segment-builder.drop-here") }}</span>
          </div>
        </template>
      </draggable>
    </div>

    <div v-if="groupIndex < groupsLength - 1" class="d-flex flex-row justify-content-center">
      <operatorSelector
        v-model:operator="group.unionType"
        size="small"
        class="mt-3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import draggable from "vuedraggable";
  import conditionCard from './conditionCard.vue'
  import { DocumentDuplicateIcon, XMarkIcon } from "@heroicons/vue/24/solid/index.js";
  import operatorSelector from "./operatorSelector.vue";
  import { ConditionGroupDto, ConditionDto } from '@/types/segmentservice';

  export interface Props {
    group: ConditionGroupDto;
    isDragging: boolean;
    groupIndex: number;
    selectedItem: ConditionDto | null;
    groupsLength: number;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'dragstart'): void;
    (e: 'dragend'): void;
    (e: 'select', item: ConditionDto, groupIndex: number, conditionIndex: number): void;
    (e: 'duplicateItem', groupIndex: number, conditionIndex: number): void;
    (e: 'deleteItem', groupIndex: number, conditionIndex: number): void;
    (e: 'duplicateGroup', groupIndex: number): void;
    (e: 'removeGroup', groupIndex: number): void;
  }>();

  const onDragStart = () => {
    emit('dragstart');
  };

  const onDragEnd = () => {
    emit('dragend');
  }

  const selectItem = (item: ConditionDto, conditionIndex: number) => {
    emit('select', item, props.groupIndex, conditionIndex);
  };

  const duplicateItem = (conditionIndex: number) => {
    emit('duplicateItem', props.groupIndex, conditionIndex);
  };

  const deleteItem = (conditionIndex: number) => {
    emit('deleteItem', props.groupIndex, conditionIndex);
  };

  const duplicateGroup = () => {
    emit('duplicateGroup', props.groupIndex);
  };

  const removeGroup = () => {
    emit('removeGroup', props.groupIndex);
  };
</script>

<style scoped>
  .drop-zone {
    border: 1px dashed;
    border-width: 1px;
    border-radius: 8px;
    height: 100px;
    width: 200px;
    margin-left: 12px;
  }
</style>