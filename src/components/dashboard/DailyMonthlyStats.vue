<template>
    <div class="col-12 md:col-6">
      <Card>
        <template #title>Kunlik statistika</template>
        <template #content>
          <Chart type="bar" :data="dailyChartData" :options="chartOptions" :height="300" />
        </template>
      </Card>
    </div>
    <div class="col-12 md:col-6">
      <Card>
        <template #title>Oylik statistika</template>
        <template #content>
          <Chart type="line" :data="monthlyChartData" :options="chartOptions" :height="300" />
        </template>
      </Card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import Chart from 'primevue/chart';

const props = defineProps({
  dailyChartData: Object,
  monthlyChartData: Object,
  chartOptions: Object
});
</script>