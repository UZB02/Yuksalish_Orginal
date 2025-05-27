<template>
  <div class="dashboard-container">
    <div class="grid gap-3">
      <!-- Umumiy statistika -->
      <div class="col-12">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span>Umumiy statistika</span>
              <Calendar v-model="dateRange" selectionMode="range" :manualInput="false" dateFormat="yy-mm-dd" showIcon />
            </div>
          </template>
          <template #content>
            <div v-if="loading" class="flex justify-content-center">
              <ProgressSpinner />
            </div>
            <div v-else class="grid">
              <div class="col-12 md:col-6 lg:col-3">
                <StatCard title="Jami sotuv" :value="`${formatCurrency(generalStats.totalSales)}`" icon="pi pi-shopping-cart" color="bg-blue-500" />
              </div>
              <div class="col-12 md:col-6 lg:col-3">
                <StatCard title="Jami foyda" :value="`${formatCurrency(generalStats.totalProfit)}`" icon="pi pi-chart-line" color="bg-green-500" />
              </div>
              <div class="col-12 md:col-6 lg:col-3">
                <StatCard title="Sotilgan mahsulotlar" :value="generalStats.totalProductsSold" icon="pi pi-box" color="bg-purple-500" />
              </div>
              <div class="col-12 md:col-6 lg:col-3">
                <StatCard title="Sotilgan aralashmalar" :value="generalStats.totalMixesSold" icon="pi pi-tags" color="bg-orange-500" />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Kunlik va oylik statistika -->
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

      <!-- Mahsulotlar statistikasi -->
      <div class="col-12">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span>Mahsulotlar bo'yicha statistika</span>
              <Dropdown v-model="selectedProduct" :options="products" optionLabel="name" optionValue="id" placeholder="Mahsulot tanlang" />
            </div>
          </template>
          <template #content>
            <div class="grid">
              <div class="col-12 md:col-8">
                <Chart type="bar" :data="productChartData" :options="chartOptions" :height="250" />
              </div>
              <div class="col-12 md:col-4">
                <div class="grid">
                  <div class="col-12">
                    <StatCard title="Sotilgan miqdor" :value="productStats.totalQuantity" small icon="pi pi-box" color="bg-indigo-100" textColor="text-indigo-800" />
                  </div>
                  <div class="col-12">
                    <StatCard title="Jami sotuv" :value="formatCurrency(productStats.totalSales)" small icon="pi pi-money-bill" color="bg-green-100" textColor="text-green-800" />
                  </div>
                  <div class="col-12">
                    <StatCard title="O'rtacha narx" :value="formatCurrency(productStats.averagePrice)" small icon="pi pi-chart-bar" color="bg-purple-100" textColor="text-purple-800" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Aralashmalar statistikasi -->
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

      <!-- So'nggi operatsiyalar -->
      <div class="col-12 lg:col-6">
        <Card>
          <template #title>So'nggi mahsulot sotuvlari</template>
          <template #content>
            <DataTable :value="recentProductSales" :rows="5" :paginator="true" responsiveLayout="scroll">
              <Column field="date" header="Sana"></Column>
              <Column field="productName" header="Mahsulot"></Column>
              <Column field="quantity" header="Miqdor"></Column>
              <Column field="price" header="Narx">
                <template #body="{data}">
                  {{ formatCurrency(data.price) }}
                </template>
              </Column>
              <Column field="total" header="Jami">
                <template #body="{data}">
                  {{ formatCurrency(data.total) }}
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
      <div class="col-12 lg:col-6">
        <Card>
          <template #title>So'nggi aralashma sotuvlari</template>
          <template #content>
            <DataTable :value="recentMixSales" :rows="5" :paginator="true" responsiveLayout="scroll">
              <Column field="date" header="Sana"></Column>
              <Column field="mixTitle" header="Aralashma"></Column>
              <Column field="quantity" header="Miqdor"></Column>
              <Column field="price" header="Narx">
                <template #body="{data}">
                  {{ formatCurrency(data.price) }}
                </template>
              </Column>
              <Column field="total" header="Jami">
                <template #body="{data}">
                  {{ formatCurrency(data.total) }}
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import ProgressSpinner from 'primevue/progressspinner';
import StatCard from '@/components/dashboard/StatCard.vue';

// Asosiy o'zgaruvchilar
const baseUrl = 'https://yuksalish-node-lwj4.onrender.com/api';
const token = sessionStorage.getItem('authToken') || 'your_jwt_token_here';

const loading = ref(true);
const dateRange = ref([new Date(), new Date()]);
const generalStats = ref({
  totalSales: 0,
  totalProfit: 0,
  totalProductsSold: 0,
  totalMixesSold: 0
});
const dailyChartData = ref({});
const monthlyChartData = ref({});
const products = ref([]);
const selectedProduct = ref(null);
const productStats = ref({});
const productChartData = ref({});
const mixes = ref([]);
const selectedMix = ref(null);
const mixStats = ref({});
const mixChartData = ref({});
const recentProductSales = ref([]);
const recentMixSales = ref([]);

// Chart opsiyalari
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return formatCurrency(value);
        }
      }
    }
  }
});

// Valyuta formatlash
const formatCurrency = (value) => {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS' }).format(value);
};

// Ma'lumotlarni yuklash funksiyalari
const fetchGeneralStats = async () => {
  try {
    const response = await axios.get(`${baseUrl}/statistics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    generalStats.value = response.data;
  } catch (error) {
    console.error('Error fetching general stats:', error);
  }
};

const fetchDailyStats = async () => {
  try {
    const date = new Date().toISOString().split('T')[0];
    const response = await axios.get(`${baseUrl}/statistics/daily?date=${date}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    dailyChartData.value = {
      labels: ['Sotuv', 'Foyda'],
      datasets: [
        {
          label: 'Kunlik statistika',
          backgroundColor: ['#42A5F5', '#66BB6A'],
          data: [data.totalExpenses, data.profit]
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching daily stats:', error);
  }
};

const fetchMonthlyStats = async () => {
  try {
    const today = new Date();
    const response = await axios.get(`${baseUrl}/statistics/monthly?year=${today.getFullYear()}&month=${today.getMonth() + 1}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    monthlyChartData.value = {
      labels: data.map(item => `Hafta ${item.week}`),
      datasets: [
        {
          label: 'Haftalik sotuv',
          data: data.map(item => item.totalSales),
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4
        },
        {
          label: 'Haftalik foyda',
          data: data.map(item => item.totalProfit),
          fill: false,
          borderColor: '#66BB6A',
          tension: 0.4
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
  }
};

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/product`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    products.value = response.data;
    if (products.value.length > 0) {
      selectedProduct.value = products.value[0].id;
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const fetchProductStats = async () => {
  if (!selectedProduct.value) return;

  try {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const response = await axios.get(`${baseUrl}/statistics/product/${selectedProduct.value}?startDate=${startDate}&endDate=${endDate}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = response.data;
    productStats.value = {
      totalQuantity: data.totalQuantity,
      totalSales: data.totalSales,
      averagePrice: data.averagePrice
    };

    productChartData.value = {
      labels: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
      datasets: [
        {
          label: 'Oylik sotuv',
          backgroundColor: '#42A5F5',
          data: data.monthlySales
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching product stats:', error);
  }
};

const fetchMixes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/mix`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    mixes.value = response.data;
    if (mixes.value.length > 0) {
      selectedMix.value = mixes.value[0].id;
    }
  } catch (error) {
    console.error('Error fetching mixes:', error);
  }
};

const fetchMixStats = async () => {
  if (!selectedMix.value) return;

  try {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const response = await axios.get(`${baseUrl}/statistics/mix/${selectedMix.value}?startDate=${startDate}&endDate=${endDate}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = response.data;
    mixStats.value = {
      totalQuantity: data.totalQuantity,
      totalSales: data.totalSales,
      averagePrice: data.averagePrice
    };

    mixChartData.value = {
      labels: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
      datasets: [
        {
          label: 'Oylik sotuv',
          backgroundColor: '#FFA726',
          data: data.monthlySales
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching mix stats:', error);
  }
};

const fetchRecentSales = async () => {
  try {
    // So'nggi mahsulot sotuvlari
    const productResponse = await axios.get(`${baseUrl}/product-history?limit=5`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    recentProductSales.value = productResponse.data.map(item => ({
      date: new Date(item.createdAt).toLocaleDateString(),
      productName: item.name,
      quantity: item.size,
      price: item.sellingPrice,
      total: item.size * item.sellingPrice
    }));

    // So'nggi mix sotuvlari
    const mixResponse = await axios.get(`${baseUrl}/mix-history?limit=5`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    recentMixSales.value = mixResponse.data.map(item => ({
      date: new Date(item.createdAt).toLocaleDateString(),
      mixTitle: item.title,
      quantity: item.size,
      price: item.sellingPrice,
      total: item.size * item.sellingPrice
    }));
  } catch (error) {
    console.error('Error fetching recent sales:', error);
  }
};

// Barcha ma'lumotlarni yuklash
const fetchAllData = async () => {
  loading.value = true;
  await Promise.all([
    fetchGeneralStats(),
    fetchDailyStats(),
    fetchMonthlyStats(),
    fetchProducts(),
    fetchMixes(),
    fetchRecentSales()
  ]);
  loading.value = false;
};

// Watcherlar
watch(selectedProduct, () => {
  fetchProductStats();
});

watch(selectedMix, () => {
  fetchMixStats();
});

watch(dateRange, () => {
  // Agar kerak bo'lsa, sana oralig'iga qarab filtrlarni qo'llash mumkin
  console.log('Date range changed:', dateRange.value);
});

// Mounted
onMounted(() => {
  fetchAllData();
});
</script>


<style scoped>
.dashboard-container {
  padding: 1rem;
}

.card {
  margin-bottom: 1rem;
}

.stat-card {
  margin-bottom: 1rem;
}

.flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}
</style>
