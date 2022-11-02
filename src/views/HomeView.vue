<script setup lang="ts">
import { computed, ref } from "vue";
import axios from "axios";
import { onMounted } from "vue";
import useSWRV from "swrv";
import LocalStorageCache from "swrv/dist/cache/adapters/localStorage";
import type ElTable from "element-plus/es/components/table";
import { ApiConstant } from "@/constant/api.constant";

const apiURL = ApiConstant.EXCHANGE_RATE;

let ratesListTable = ref();

let page = ref(1);
let pageSize = ref(5);

let errorMsg = ref();

const tableRef = ref<InstanceType<typeof ElTable>>();

async function displayRatesList() {
  const { data: res, mutate } = useSWRV(apiURL, fetcher, {
    cache: new LocalStorageCache("rates-list"),
    shouldRetryOnError: false,
  });

  if (!res._object.data) {
    await mutate();
  }

  if (!res._object.error && res._object.data) {
    ratesListTable.value = Object.entries(res._object.data.rates).map(
      (item: any[]) => ({
        key: item[0],
        info: item[1],
      })
    );
  }
}

const fetcher = async (url: string) => {
  const request = await axios
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      errorMsg.value = error.message;

      throw error.message;
    });

  return request;
};

const displayRatesListTable = computed(() => {
  return ratesListTable.value.slice(
    pageSize.value * page.value - pageSize.value,
    pageSize.value * page.value
  );
});

const formatter = (val: any) => {
  return val.info.value.toFixed(2);
};

function clearSorting() {
  tableRef.value.clearSort();
}

const handlePaginationChange = (val: number) => {
  page.value = val;
  clearSorting();
};

const handlePageSizeChange = (val: number) => {
  pageSize.value = val;
  clearSorting();
};

onMounted(() => {
  displayRatesList();
});
</script>

<template>
  <main>
    <div class="container">
      <div class="py-10">
        <h1 class="mb-5 font-bold text-lg">Rates List</h1>

        <div v-if="ratesListTable">
          <el-table
            ref="tableRef"
            :class="'mb-10 w-full'"
            :data="displayRatesListTable"
          >
            <el-table-column
              fixed
              sortable
              prop="info.name"
              label="Name"
              min-width="150"
            />
            <el-table-column
              class-name="text-right"
              sortable
              prop="info.type"
              label="Type"
            />
            <el-table-column
              class-name="text-right"
              prop="info.unit"
              label="Unit"
            />
            <el-table-column
              class-name="text-right"
              sortable
              prop="info.value"
              :formatter="formatter"
              label="Value"
              min-width="150"
            />
          </el-table>

          <div class="hidden lg:block">
            <el-pagination
              :class="'justify-end px-0'"
              background
              layout="sizes, prev, pager, next"
              :total="ratesListTable.length"
              @current-change="handlePaginationChange"
              @size-change="handlePageSizeChange"
              :page-sizes="[5, 10, 25, 100]"
              :page-size="pageSize"
            />
          </div>

          <div class="lg:hidden">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="ratesListTable.length"
              @current-change="handlePaginationChange"
              @size-change="handlePageSizeChange"
              :page-sizes="[5, 10, 25]"
              :page-size="pageSize"
            />
          </div>
        </div>

        <div v-else>
          <el-empty
            :image-size="200"
            description="Oops, there is something wrong with the server. We are fixing it. Please try again later."
          />
        </div>
      </div>
    </div>
  </main>
</template>
