<script setup lang="ts">
import { computed, reactive, ref } from '@vue/reactivity';
import axios from 'axios';
import { onMounted } from 'vue';
import useSWRV from 'swrv';
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage';

const apiURL = "https://api.coingecko.com/api/v3/exchange_rates";

let ratesListTable = ref();

let page = ref(1);
let pageSize = ref(5);
let totalPages = ref(0);

let errorMsg = ref();


async function displayRatesList() {
  const { data: res, error } = useSWRV(apiURL, fetcher, {
    cache: new LocalStorageCache('swrv'),
    shouldRetryOnError: false
  });

  console.log("resError > " + JSON.stringify(res));

  // const res = await axios.get(apiURL).catch(function (error) {
  //   errorMsg = error.message;
  // });

  if (res._object.data != false) {
    ratesListTable.value = Object.entries(res._object.data.rates).map((item: any[]) => ({
      key: item[0],
      info: item[1],
    }));
  }
}

const fetcher = async (url: string) => {
  await axios.get(url).catch(function (error) {
    errorMsg = error.message;
    return null;

  }).then(response => {
    if(response){
      return response.data;
    } else {
      return null;
    }
  });
}


const displayRatesListTable = computed(() => {
  return ratesListTable.value.slice(pageSize.value * page.value - pageSize.value, pageSize.value * page.value);
});

const handlePaginationChange = (val: number) => {
  page.value = val;
}

const handlePageSizeChange = (val: number) => {
  pageSize.value = val;
}

onMounted(() => {
  displayRatesList();
});

</script>

<template>
  <main>
    <div class="container">
      <div class="mt-5">
        <h1 class="mb-5 font-bold">Rates List</h1>

        <div v-if="ratesListTable">
          <KeepAlive>
            <el-table :class="'mb-10'" :data="displayRatesListTable" style="width: 100%">
              <el-table-column sortable prop="info.name" label="Name" />
              <el-table-column sortable prop="info.type" label="Type" />
              <el-table-column prop="info.unit" label="Unit" />
              <el-table-column sortable prop="info.value" label="Value" />
            </el-table>
          </KeepAlive>

          <div class="text-right">
            <el-pagination layout="sizes, prev, pager, next" :total="ratesListTable.length"
              @current-change="handlePaginationChange" @size-change="handlePageSizeChange" :page-sizes="[5, 10, 25]"
              :page-size="pageSize" />
          </div>
        </div>

      </div>
    </div>

  </main>
</template>
