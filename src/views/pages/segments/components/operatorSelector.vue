<template>
    <el-dropdown trigger="click" size="large" placement="bottom-start">
      <div
        :class="{
          'px-2 rounded-2': size === 'small',
          'px-3 py-1 rounded-3': size === 'medium',
        }"
        :style="{
          'font-weight': size === 'small' ? 400 : 500,
        }"
        class="el-dropdown-link text-uppercase d-flex align-items-center justify-content-center align-items-center bg-lightgrey border border-cta-2-secondary">
        <span v-if="operator === UnionType.And">{{ $t("segments.segment-builder.and") }} </span>
        <span v-if="operator === UnionType.Or"> {{ $t("segments.segment-builder.or") }} </span>
        <span v-if="operator === UnionType.Undefined"> {{ $t("segments.segment-builder.undefined") }} </span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.43496 4.25109C9.74733 3.9163 10.2546 3.9163 10.567 4.25109L13.7657 7.67928C13.9956 7.92568 14.063 8.2926 13.9381 8.61399C13.8131 8.93539 13.5233 9.14429 13.1984 9.14429H6.80106C6.47869 9.14429 6.18631 8.93539 6.06137 8.61399C5.93642 8.2926 6.00639 7.92568 6.23379 7.67928L9.43246 4.25109H9.43496ZM9.43496 15.7489L6.23629 12.3207C6.00639 12.0743 5.93892 11.7074 6.06387 11.386C6.18881 11.0646 6.47869 10.8557 6.80356 10.8557H13.1984C13.5208 10.8557 13.8131 11.0646 13.9381 11.386C14.063 11.7074 13.9931 12.0743 13.7657 12.3207L10.567 15.7489C10.2546 16.0837 9.74733 16.0837 9.43496 15.7489Z"
            fill="#444647" />
        </svg>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="operator, index in operators" :key="`operator-${index}`"
            @click="setOperator(operator.value)">
            <div class="text-uppercase">
              {{ $t(operator.label) }}
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
</template>

<script setup lang="ts">
  import { UnionType } from '@/enums/Segments'

  interface Props {
    size: string;
    operator: string;
  }

  interface Emits {
    (e: 'update:operator', value: string): void;
  }

  interface Operator {
    label: string;
    value: string;
  };

  const props = withDefaults(defineProps<Props>(), {
    size: 'medium',
    operator: UnionType.Or,
  });

  const emit = defineEmits<Emits>();

  const operators: Operator[] = [
    {
      label: 'segments.segment-builder.and',
      value: UnionType.And,
    },
    {
      label: 'segments.segment-builder.or',
      value: UnionType.Or,
    },
  ];

  const setOperator = (operatorValue: string) => {
    emit('update:operator', operatorValue);
  }
</script>
