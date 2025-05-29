<template>
  <div class="col-12">
    <Card>
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <span>Aralashmalar bo'yicha statistika</span>
          <Dropdown v-model="selectedMix" :options="mixes" optionLabel="title" optionValue="id" placeholder="Aralashma tanlang" />
        </div>
      </template>
      <template #content>
        <div class="grid">
          <div class="col-12 md:col-8">
            <Chart type="bar" :data="mixChartData" :options="chartOptions" :height="250" />
          </div>
          <div class="col-12 md:col-4">
            <div class="grid">
              <div class="col-12">
                <StatCard title="Sotilgan miqdor" :value="mixStats.totalQuantity" small icon="pi pi-box" color="bg-indigo-100" textColor="text-indigo-800" />
              </div>
              <div class="col-12">
                <StatCard title="Jami sotuv" :value="formatCurrency(mixStats.totalSales)" small icon="pi pi-money-bill" color="bg-green-100" textColor="text-green-800" />
              </div>
              <div class="col-12">
                <StatCard title="O'rtacha narx" :value="formatCurrency(mixStats.averagePrice)" small icon="pi pi-chart-bar" color="bg-purple-100" textColor="text-purple-800" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Dropdown from 'primevue/dropdown';
import StatCard from '@/components/dashboard/StatCard.vue';

const props = defineProps({
  mixes: Array,
  mixStats: Object,
  mixChartData: Object,
  chartOptions: Object,
  formatCurrency: Function
});

const emit = defineEmits(['mixSelected']);

const selectedMix = ref(null);

watch(selectedMix, (newVal) => {
  emit('mixSelected', newVal);
});
</script>