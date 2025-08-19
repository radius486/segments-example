<template>
  <el-dialog
    class="segment-profile-dialog"
    :model-value="props.show"
    lock-scroll
    width="60%"
    destroy-on-close
    style="border-radius: 16px 16px 16px 16px"
    @close="emit('close')"
  >
    <template #header>
      <div class="d-flex flex-row gap-3 align-items-center">
        <svg
          style="height: 24px; width: 24px"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6"
        >
          <path
            fill-rule="evenodd"
            d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
            clip-rule="evenodd"
          />
          <path
            d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z"
          />
        </svg>

        <div style="font-size: 24px; font-weight: 600">{{ t('segments.segment-page.participants-dialog.title') }}</div>
      </div>
    </template>

    <div>
      <div class="input-group my-2 w-40">
        <span class="input-group-text">
          <i class="fas fa-search"></i>
        </span>
        <input v-model="profileSearch.searchString" v-focus type="text" class="form-control" :placeholder="'Search'" />
      </div>

      <div>
        <el-table
          v-loading="fetchingProfiles"
          :data="profiles"
          class="el-table_pointer"
          stripe
          row-key="id"
          header-row-class-name="table"
          :default-sort="{ prop: 'CreatedUtc', order: 'descending' }"
          @sort-change="sortChange"
          @row-click="onRowClick"
        >
          <el-table-column
            :label="t('segments.segment-page.participants-dialog.id-header')"
            prop="Id"
            sortable="custom"
          >
            <template #default="{ row }: { row: SegmentProfileDto }">
              <span class="pt-2 text-truncate">{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('segments.segment-page.participants-dialog.firstname-header')"
            prop="FirstName"
            sortable="custom"
          >
            <template #default="{ row }: { row: SegmentProfileDto }">
              <span class="pt-2 text-truncate">{{ row.firstName ? row.firstName : '-/-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('segments.segment-page.participants-dialog.lastname-header')"
            prop="LastName"
            sortable="custom"
          >
            <template #default="{ row }: { row: SegmentProfileDto }">
              <span class="pt-2 text-truncate">{{ row.lastName ? row.lastName : '-/-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('segments.segment-page.participants-dialog.email-header')"
            prop="EmailAddress.Address"
            sortable="custom"
          >
            <template #default="{ row }: { row: SegmentProfileDto }">
              <span class="pt-2 text-truncate">{{ row.emailAddress ? row.emailAddress.address : '-/-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('segments.segment-page.participants-dialog.created-header')"
            prop="CreatedUtc"
            sortable="custom"
          >
            <template #default="{ row }: { row: SegmentProfileDto }">
              <span class="pt-2 text-truncate">{{ toLocalDateTime(row.createdUtc) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="d-flex flex-row gap-3">
          <el-pagination
            v-model:current-page="profileSearch.page"
            v-model:page-size="profileSearch.pageSize"
            class="py-4 pe-none w-100"
            :page-count="profilePagination.totalPages"
            :total="profilePagination.totalItems"
            background
          >
          </el-pagination>

          <ExpandIconOutline
            v-if="!isTableExpanded && profilePagination.totalItems > 5"
            class="expand-btn"
            @click="handleExpandTransaction"
          />

          <MinimizeIconOutline
            v-if="isTableExpanded && profilePagination.totalItems > 5"
            class="expand-btn"
            @click="handleExpandTransaction"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, watch, toValue, onMounted, onUnmounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { debouncedWatch } from '@vueuse/core';
  import { useI18n } from 'vue-i18n';
  import ExpandIconOutline from '@/components/Icons/ExpandIconOutline.vue';
  import MinimizeIconOutline from '@/components/Icons/MinimizeIconOutline.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useLocaleDateTime } from '@/composables/useLocaleDateTime';
  import { useSegmentsStore } from '@/stores/segments';
  import { SegmentProfileDto } from '@/types/segmentservice/dto';

  const props = defineProps<{
    segmentId: string;
    show: boolean;
  }>();

  const emit = defineEmits<{
    (event: 'close'): void;
  }>();

  const segmentsStore = useSegmentsStore();

  const { fetchProfiles, resetProfiles, resetProfileSearch } = segmentsStore;

  const { fetchingProfiles, getProfiles, profilePagination, profileSearch } = storeToRefs(segmentsStore);

  const router = useRouter();
  const route = useRoute();

  const isTableExpanded = ref<boolean>(false);
  const profileSearchValue = toValue(profileSearch);
  const DEBOUNCE_TIME = 1000;
  const profiles = getProfiles;
  const DEFAULT_PAGE = 1;
  const DESC = 'descending';

  const { t } = useI18n();
  const { toLocalDateTime } = useLocaleDateTime();

  const handleExpandTransaction = (): void => {
    isTableExpanded.value = !isTableExpanded.value;
    profileSearch.value.pageSize = isTableExpanded.value ? 20 : 10;
  };

  const sortChange = (data: { column: any; prop: string; order: any }): void => {
    profileSearchValue.sortColumn = data.prop;
    profileSearchValue.descending = data.order === DESC;
  };

  const onSearch = async (): Promise<void> => {
    resetProfiles();
    fetchProfiles();
  };

  const onRowClick = (row: SegmentProfileDto): void => {
    const resolvedRoute = router.resolve({
      name: 'View member',
      params: { id: row.id },
      query: {
        ...route.query,
      },
    });
    window.open(resolvedRoute.href, '_blank');
  };

  watch(
    () => [
      profileSearchValue.sortColumn,
      profileSearchValue.descending,
      profileSearchValue.page,
      profileSearchValue.pageSize,
    ],
    () => onSearch()
  );

  watch(
    () => props.show,
    show => {
      if (show) {
        onSearch();
      }
    }
  );

  debouncedWatch(
    () => profileSearchValue.searchString,
    async () => {
      await onSearch();
      profileSearchValue.page = DEFAULT_PAGE;
    },
    { debounce: DEBOUNCE_TIME }
  );

  onUnmounted(() => {
    resetProfiles();
    resetProfileSearch();
  });
</script>

<style>
  .segment-profile-dialog .el-dialog__body {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }
</style>
