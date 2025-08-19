<template>
	<nav
		:class="{ minimized: isMinimized }"
		class="bg-white fixed-bottom border-top border-join-lightsilver d-flex flex-column ps-8 pe-4 justify-content-start pt-3">
		<div class="d-flex flex-row justify-content-between">
			<div
				class="d-flex flex-row gap-3 align-items-center text-nowrap pb-2"
				:class="{ 'w-100': isMinimized }"
				@click="isMinimized ? toggleMinimize() : ''">
				<h4 v-if="!isMinimized">{{ $t('segments.segment-builder.library.library') }}</h4>
				<h5 v-else>{{ $t('segments.segment-builder.library.library') }}</h5>
				<el-input
					v-if="!isMinimized"
					v-model="searchString"
					v-focus
					size="small"
					type="text"
					style="width: 240px"
					:placeholder="$t('segments.segment-builder.library.search-placeholder')"
					aria-label="Text input with icon"
					aria-describedby="basic-addon1">
					<template #prefix>
						<i class="fas fa-search"></i>
					</template>
				</el-input>
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

		<el-tabs v-if="!isMinimized" v-model="activeTab" style="max-height: 85%;">
			<el-tab-pane
        v-for="category, categoryIndex in AttributeCategory"
        :key="`category-tab-${categoryIndex}`"
        :name="category" class="h-100">
				<template #label>
          <div class="d-flex align-items-center gap-2 mb-2">
            <i
              class="fas my-auto text-sm"
              :class="getCategoryClasses(category)">
            </i>
            <span style="font-size: 16px">
              {{ category }}
            </span>
          </div>
				</template>
        <div class="h-100 pe-3 overflow-scroll">
          <draggable
            itemKey="dataField"
            :list="attributeLibrary[category]"
            :group="{ name: 'items', pull: 'clone', put: false }"
            :clone="cloneItem"
            :sort="false"
            :animation="300"
            class="row"
            @start="onDragStart"
            @end="onDragEnd">
            <template #item="{ element: item }">
              <div class="col-lg-4 mb-3">
                <div
                  class="attribute-item d-flex flex-row justify-content-between align-items-center rounded bg-lightgrey border border-cta-2-secondary text-sm fw-bold  px-2 py-1"
                  style="min-width: 100px; cursor: pointer;">
                    <span>{{ item.dataField }}</span>
                  <img src="@/assets/img/draggable.svg" />
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </el-tab-pane>
			<el-tab-pane name="custom attributes" class="h-100">
				<template #label>
          <div class="d-flex align-items-center gap-2 mb-2">
            <i class="fa-brands fa-creative-commons-by text-join-myrtlegreen" style="margin-left: 2px;"></i>
            <span style="font-size: 16px">{{
              $t('segments.segment-builder.library.custom-attributes')
            }}</span>
          </div>
				</template>
        <div class="h-100 pe-3 overflow-scroll">
          <draggable
            :list="customAttributeLibrary"
            :group="{ name: 'items', pull: 'clone', put: false }"
            itemKey="dataField"
            :clone="cloneItem"
            :sort="false"
            :animation="300"
            class="row"
            @start="onDragStart"
            @end="onDragEnd">
            <template #item="{ element: item }">
              <div class="col-lg-4 mb-3">
                <div
                  class="attribute-item d-flex flex-row justify-content-between align-items-center rounded bg-lightgrey border border-cta-2-secondary text-sm fw-bold  px-2 py-1"
                  style="min-width: 100px; cursor: pointer;">
                    <span>{{ item.dataField }}</span>
                  <img src="@/assets/img/draggable.svg" />
                </div>
              </div>
            </template>
          </draggable>
        </div>
			</el-tab-pane>
		</el-tabs>
	</nav>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
	import draggable from 'vuedraggable';
  import { AttributeCategory } from '@/enums/Segments';
  import { useSegmentsStore } from '@/stores/segments';
  import { ConditionDto } from '@/types/segmentservice/dto';

  const emit = defineEmits<{
    (e: 'rename'): void;
    (e: 'dragstart'): void;
    (e: 'dragend'): void;
    (e: 'clone'): void;
  }>();

  const segmentsStore = useSegmentsStore();

  const {
    getAttributeLibrary,
    getCustomAttributeLibrary,
  } = storeToRefs(segmentsStore);

  const attributeLibrary = getAttributeLibrary;
  const customAttributeLibrary = getCustomAttributeLibrary;
  const searchString = ref('');
  const isMinimized = ref(false);
  const toggleMinimize = () => {
    isMinimized.value = !isMinimized.value;
  };

  const rename = () => {
    console.log('Rename segment');
    emit('rename');
  };

  const activeTab = ref(AttributeCategory.Transaction);

  const onDragStart = () => {
    emit('dragstart');
  };

  const onDragEnd = () => {
    emit('dragend');
  };

  const cloneItem = (original: ConditionDto) => {
    emit('clone');
    return { ...JSON.parse(JSON.stringify(original)) };
  };

  const getCategoryClasses = (category: AttributeCategory) => {
    return [
      category === AttributeCategory.Transaction ? 'fa-shopping-cart text-join-transactions' : '',
      category === AttributeCategory.Member ? 'fa-users text-join-members' : '',
      category === AttributeCategory.Achievement ? 'fa-trophy text-join-achievements' : '',
      category === AttributeCategory.Reward ? 'fa-gift text-join-rewards' : '',
    ]
  };
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

	.item-item {
		cursor: grab;
	}

	.el-tabs {
		border-radius: 0 !important;
		box-shadow: none !important;
	}

	.el-tabs__nav-wrap {
		border-radius: 0 !important;
		box-shadow: none !important;
	}

	.el-tabs__header {
		border-radius: 0 !important;
		box-shadow: none !important;
	}
</style>
