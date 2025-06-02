<template>
  <div class="card">
    <h1 class="text-xl">Sotuv statistikasi</h1>
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-auto" />
  </div>
</template>

<script setup>
import { ref, defineProps, watch, onMounted } from 'vue';
import axios from 'axios';

// Props
const props = defineProps({
  date: {
    type: Date,
    required: true
  }
});

// Refs
const chartData = ref(null);
const chartOptions = ref({});
const apiData = ref([]);

// API chaqiruv
const getData = async () => {
  try {
    const year = props.date.getFullYear();
    const res = await axios.get(`/api/statistics/chart?year=${year}`);
    apiData.value = res.data;
    chartData.value = setChartData(apiData.value); // Grafikni yangilash
  } catch (error) {
    console.error('Xatolik:', error);
  }
};

// Grafik uchun data tayyorlovchi funksiya
const setChartData = (dataFromApi) => {
  const documentStyle = getComputedStyle(document.documentElement);

  const mixData = dataFromApi.map(item => item.mixCount);
  const productData = dataFromApi.map(item => item.productCount);

  return {
    labels: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
    datasets: [
      {
        label: 'Aralashma',
        backgroundColor: documentStyle.getPropertyValue('--p-green-500'),
        borderColor: documentStyle.getPropertyValue('--p-green-500'),
        data: mixData
      },
      {
        label: 'Mahsulot',
        backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
        borderColor: documentStyle.getPropertyValue('--p-gray-500'),
        data: productData
      }
    ]
  };
};

// Lifecycle: dastlabki chaqiruv
onMounted(() => {
  getData();
});

// Props.date o‘zgarganda so‘rovni qayta yuborish
watch(() => props.date, () => {
  getData();
});
</script>
