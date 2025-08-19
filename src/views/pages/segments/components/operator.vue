<template>
  <div
    :class="{
      'px-1 rounded-2': size === 'small',
      'px-3 py-1 rounded-3': size === 'medium',
    }"
    :style="{
      'font-weight': size === 'small' ? 400 : 500,
      'width': size === 'small' ? '50px' : '65px',
    }"
    class="text-uppercase d-flex align-items-center justify-content-center align-items-center bg-lightgrey border border-cta-2-secondary">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  size: {
    type: String,
    default: 'medium'
  }
})

</script>
