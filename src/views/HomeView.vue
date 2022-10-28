<script setup lang="ts">
import { computed, reactive, ref } from '@vue/reactivity';
import axios from 'axios';
import { onMounted } from 'vue';

let ratesListTable = ref();

let page = ref(1);
let pageSize = ref(5);
let totalPages = ref(0);

let errorMsg = ref();


async function displayRatesList() {
  const res = await axios.get("https://api.coingecko.com/api/v3/exchange_rates").catch(function (error) {
    errorMsg = error.message;
  });

  if (res) {
    ratesListTable.value = Object.entries(res.data.rates).map((item: any[]) => ({
      key: item[0],
      info: item[1],
    }));
  }



  // console.log(JSON.stringify(ratesListTable.value));
  // console.log(JSON.stringify(res));
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
          <el-table :class="'mb-10'" :data="displayRatesListTable" style="width: 100%">
            <el-table-column sortable prop="info.name" label="Name" />
            <el-table-column sortable prop="info.type" label="Type" />
            <el-table-column prop="info.unit" label="Unit" />
            <el-table-column sortable prop="info.value" label="Value" />
          </el-table>

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
