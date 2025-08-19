<template>
	<div class="container-fluid">
		<div class="row mt-5 mb-3">
			<div class="d-flex flex-column flex-sm-row justify-content-between align-items-center">
				<h1 class="text-dark">
					{{ $t('segments.title-segments') }}
				</h1>
				<div class="d-flex flex-wrap gap-3">
					<router-link
						class="btn btn-loyalty-primary text-white text-capitalize fw-normal float-end mb-0"
						style="width: 190px; height: ;"
						:to="{ name: 'Create segment' }">
						<i class="fas fa-filter text-white mx-2 my-auto"></i>
						{{ $t('segments.btn-segment-builder') }}
					</router-link>
				</div>
			</div>
		</div>
    <div class="row">
      <div class="col-lg">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-12">
                <h4>{{ $t('segments.search-title') }}</h4>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-md-3 col-8">
                <div class="input-group mb-4">
                  <span class="input-group-text">
                    <i class="fas fa-search"></i>
                  </span>
                  <input
                    v-model="segmentSearch.searchString"
                    v-focus
                    type="text"
                    class="form-control"
                    :placeholder="t('segments.search-placeholder')"
                    aria-label="Name"
                    aria-describedby="basic-addon1"
                  />
                </div>
              </div>
              <div class="col-lg-12">
                <el-table
                  v-loading="fetchingSegments"
                  class="el-table_pointer"
                  stripe
                  :data="segments"
                  row-key="id"
                  header-row-class-name="table"
                  :default-sort="{ prop: 'CreatedUtc', order: 'descending' }"
                  @sort-change="sortChange"
                  @row-click="handleRowClick"
                >
                  <el-table-column :label="t('segments.segment-name')" prop="Name" sortable="custom">
                    <template #default="{ row }: { row: SegmentDto }">
                      <span class="pt-2">{{ row.name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('segments.profiles')" prop="LastModifiedByUserId" sortable="custom">
                    <template #default="{ row }: { row: SegmentDto }">
                      <span class="pt-2">{{ row.numberOfMembers || 0 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('segments.count-updated')" prop="LastModifiedUtc" sortable="custom">
                    <template #default="{ row }: { row: SegmentDto }">
                      <span v-if="row.lastEvaluatedAt" class="pt-2">{{ toLocalDateTime(row.lastEvaluatedAt) }}</span>
                      <span v-else> -/- </span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('segments.created')" prop="CreatedUtc" sortable="custom">
                    <template #default="{ row }: { row: SegmentDto }">
                      <span class="pt-2">{{ toLocalDateTime(row.createdAt) }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- Pagination -->
                <el-pagination
                  v-model:current-page="segmentSearch.page"
                  v-model:page-size="segmentSearch.pageSize"
                  class="py-4 pe-none"
                  :page-count="segmentPagination.totalPages"
                  :total="segmentPagination.totalItems"
                  background
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
	</div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, watch, toValue } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useRouter, useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { debouncedWatch } from '@vueuse/core';
  import { useLocaleDateTime } from '@/composables/useLocaleDateTime';
  import { SegmentDto } from '@/types/segmentservice';
  import { useSegmentsStore } from '@/stores/segments';
import useErrorHandler from '@/composables/useErrorHandler';
import { resetSegmentError } from '@/stores/segments/actions';
import { segmentError } from '@/stores/segments/state';

  const segmentsStore = useSegmentsStore();
  const { toLocalDateTime } = useLocaleDateTime();
  const { handleError } = useErrorHandler();
  const { t } = useI18n();
  const router = useRouter();
  const route = useRoute();

  const {
    searchSegments,
    resetSegments,
    resetSegmentSearch,
  } = segmentsStore;

  const {
    fetchingSegments,
    getSegments,
    segmentPagination,
    segmentSearch,
  } = storeToRefs(segmentsStore);

  const segmentSearchValue = toValue(segmentSearch);
  const DEBOUNCE_TIME = 1000;
  const segments = getSegments;
  const DEFAULT_PAGE = 1;
  const DESC = 'descending';
  const SEGMENT_ROUTE_NAME = 'Segment page';

  const handleRowClick = (segment: SegmentDto): void => {
    router.push({
      name: SEGMENT_ROUTE_NAME,
      params: { id: segment.id },
      query: {
        ...route.query,
      },
    });
  };

  const sortChange = (data: { column: any; prop: string; order: any }): void => {
    segmentSearchValue.sortColumn = data.prop;
    segmentSearchValue.descending = data.order === DESC;
  };

  const onSearch = async (): Promise<void> => {
    resetSegments();
    searchSegments();
  };

  watch(
    () => [
      segmentSearchValue.sortColumn,
      segmentSearchValue.descending,
      segmentSearchValue.page,
    ],
    () => onSearch(),
  );

  watch(() => segmentError.value, (err) => {
    if (err) {
      handleError(err);
    }
  });

  debouncedWatch(
    () => segmentSearchValue.searchString,
    async () => {
      await onSearch();
      segmentSearchValue.page = DEFAULT_PAGE;
    },
    { debounce: DEBOUNCE_TIME },
  )

  onMounted(() => {
    onSearch();
  });

  onUnmounted(() => {
    resetSegments();
    resetSegmentSearch();
    resetSegmentError();
  });
</script>

<style scoped>
  .el-collapse-item__arrow {
    margin-left: 20px !important;
    margin-top: 5px !important;
    height: 18px !important;
    width: 18px !important;
  }

  .el-collapse-item__header:hover .el-collapse-item__arrow svg {
    transform: scale(1.2);
    transition: all 0.4s ease-in-out;
  }

  .el-collapse-item__arrow svg {
    height: 18px !important;
    width: 18px !important;
    transition: all 0.4s ease-in-out;
  }

  .advancedSearch:hover {
    color: #0b4f4a;
    transition: color 0.4s ease-in-out;
  }
</style>
