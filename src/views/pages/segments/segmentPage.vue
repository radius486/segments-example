<template>
	<div class="container-fluid">
		<div class="row mt-5 mb-3">
      <loading
        v-model:active="fetchingSegment"
        :opacity="1"
        :is-full-page="false"
        :height="40"
        transition="none"
      ></loading>
			<div v-if='currentSegment'
        class="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-2">
				<h1 class="text-dark">
					{{ segmentName }}
				</h1>
				<div class="d-flex flex-wrap gap-3 align-items-center">
          <el-button
            dark
            size="large"
            style="width: 190px; height: 44px;"
            rounded
            class="bg-cta-2-primary text-white text-capitalize fw-normal float-end text-md"
            @click="showDialog = true"
          >
						<i class="fas fa-user-group text-white mx-2 my-auto"></i>
						{{ $t('segments.btn-view-profiles') }}
          </el-button>
					<router-link
						class="btn btn-loyalty-primary text-white text-capitalize fw-normal float-end mb-0"
						style="width: 190px; height: 42px;"
						:to="{ name: 'Edit segment' }">
						<i class="fas fa-edit text-white mx-2 my-auto"></i>
						{{ $t('segments.btn-segment-edit') }}
					</router-link>
					<router-link
						class="btn btn-default text-white text-capitalize fw-normal float-end mb-0"
						style="width: 190px; height: 42px;"
						:to="{ name: 'Segments' }">
						<i class="fas fa-long-arrow-alt-left text-white mx-2"></i>
						{{ $t('segments.btn-back-to-segments') }}
					</router-link>
				</div>
			</div>
      <div class="d-flex flex-row gap-3 align-items-center">
        <div class="d-flex flex-row gap-2 align-items-center">
          <i class="fas fa-users my-auto"></i>
          <el-tooltip
            effect="light"
            :content="$t('segments.segment-builder.segmented-profiles-tooltip')"
            placement="top">
            <span class="text-sm"
              >{{ $t("segments.segment-builder.segmented-profiles") }}: {{ segmentProfileCount }}
            </span>
          </el-tooltip>
        </div>
        <IdWrapper :id="(segmentId as string)" />
      </div>
		</div>
    <div class="row">
      <div class="col-lg">
        <div class="card">
          <div class="card-body p-4">
            <div class="row mb-3">
              <div class="col-lg-12">
                <h4>{{ $t('segments.segment-page.title') }}</h4>
                <p>{{ segmentDescription }}</p>
              </div>
            </div>
            <div class="d-flex flex-column gap-3">
              <template v-for="(group, groupIndex) in conditionGroups" :key="`group-${groupIndex}`">
                <div class="d-flex align-items-start gap-4">
                  <template v-for="(condition, conditionIndex) in group.conditions" :key="`condition-${conditionIndex}`">
                    <conditionCard
                      :conditionIndex="conditionIndex"
                      style="width: 300px"
                      class="flex-shrink-0"
                      :selected="false"
                      :showActions="false"
                      :condition="condition" />
                    <operator v-if="condition.unionType && group.conditions[conditionIndex + 1]">
                      {{ condition.unionType }}
                    </operator>
                  </template>
                </div>
                <div class="d-flex">
                  <operator
                    v-if="group.unionType && conditionGroups[groupIndex + 1]"
                    size="small">
                    {{ group.unionType }}
                  </operator>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <segmentProfilesDialog
      :segmentId="(segmentId as string)"
      :show="showDialog"
      @close="showDialog = false"
    />
	</div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import Loading from 'vue-loading-overlay';
  import conditionCard from './components/conditionCard.vue'

  import operator from './components/operator.vue';
  import IdWrapper from '@/components/IdWrapper.vue';
  import useErrorHandler from '@/composables/useErrorHandler.js';
  import segmentProfilesDialog from './dialogs/segmentProfilesDialog.vue';

  import { useSegmentsStore } from '@/stores/segments';

  const { handleError } = useErrorHandler();
  const route = useRoute();
  const { id: segmentId } = route.params;

  const segmentsStore = useSegmentsStore();

  const {
    fetchSegment,
    resetSegment,
    resetSegmentError,
    calculateProfiles,
  } = segmentsStore;

  const {
    fetchingSegment,
    getConditionGroups,
    segmentProfileCount,
    currentSegment,
    getSegmentName,
    getSegmentDescription,
    calculatingProfiles,
    segmentError,
  } = storeToRefs(segmentsStore);

  const conditionGroups = getConditionGroups;
  const segmentName = getSegmentName;
  const segmentDescription = getSegmentDescription;
  const showDialog = ref(false);

  watch(() => segmentError.value, (err) => {
    if (err) {
      handleError(err);
    }
  });

  onMounted(() => {
    fetchSegment(segmentId as string);
    calculateProfiles(segmentId as string);
  });

  onUnmounted(() => {
    resetSegment();
    resetSegmentError();
  });
</script>
