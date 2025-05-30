<script setup>
import { ref, onMounted } from 'vue';

// PrimeVue komponentlari importi
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Card from 'primevue/card';

// Sizning komponentlar
import SummaryCards from '../components/dashboard/SummaryCards.vue';
import IncomeChart from '../components/dashboard/IncomeChart.vue';
import TodayStats from '../components/dashboard/TodayStats.vue';
import RecentSalesTable from '../components/dashboard/RecentSalesTable.vue';

// Utils funksiyalar
import { makeRequest, formatCurrency, formatDate } from './../utils/utils.js';

const baseUrl = 'https://yuksalish-node-lwj4.onrender.com/api';
const token = ref(sessionStorage.getItem('authToken') || localStorage.getItem('authToken') || '');

const loading = ref(false);
const error = ref('');
const endDate = ref(new Date());  // endDate Date obyekt sifatida

const generalStats = ref(null);
const dailyStats = ref(null);
const monthlyStats = ref([]);
const products = ref([]);
const mixes = ref([]);
const recentProductSales = ref([]);
const recentMixSales = ref([]);

const fetchGeneralStats = async () => {
  try {
    const data = await makeRequest(baseUrl, token.value, '/statistics');
    generalStats.value = {
      totalSales: data.totalSales || 0,
      salesGrowth: data.salesGrowth || 0,
      totalProfit: data.totalProfit || 0,
      profitGrowth: data.profitGrowth || 0,
      totalProductsSold: data.totalProductsSold || 0,
      totalMixesSold: data.totalMixesSold || 0
    };
  } catch (err) {
    console.error('Error fetching general stats:', err);
  }
};

const fetchDailyStats = async () => {
  try {
    const dateStr = endDate.value.toISOString().split('T')[0];
    const data = await makeRequest(baseUrl, token.value, `/statistics/daily?date=${dateStr}`);
    dailyStats.value = {
      totalSales: data.totalSales || 0,
      profit: data.profit || 0,
      totalOrders: data.totalOrders || 0
    };
  } catch (err) {
    console.error('Error fetching daily stats:', err);
  }
};

const fetchMonthlyStats = async () => {
  try {
    const year = endDate.value.getFullYear();
    const month = endDate.value.getMonth() + 1;
    const data = await makeRequest(baseUrl, token.value, `/statistics/monthly?year=${year}&month=${month}`);
    monthlyStats.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching monthly stats:', err);
  }
};

const fetchProducts = async () => {
  try {
    const data = await makeRequest(baseUrl, token.value, '/product');
    products.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching products:', err);
  }
};

const fetchMixes = async () => {
  try {
    const data = await makeRequest(baseUrl, token.value, '/mix');
    mixes.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching mixes:', err);
  }
};

const fetchRecentSales = async () => {
  try {
    const productData = await makeRequest(baseUrl, token.value, '/product-history?limit=10');
    recentProductSales.value = Array.isArray(productData) ? productData : [];

    const mixData = await makeRequest(baseUrl, token.value, '/mix-history?limit=10');
    recentMixSales.value = Array.isArray(mixData) ? mixData : [];
  } catch (err) {
    console.error('Error fetching recent sales:', err);
  }
};

const fetchAllData = async () => {
  if (!token.value) {
    error.value = 'Autentifikatsiya tokeni topilmadi. Iltimos, qayta kiring.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await Promise.all([
      fetchGeneralStats(),
      fetchDailyStats(),
      fetchMonthlyStats(),
      fetchProducts(),
      fetchMixes(),
      fetchRecentSales()
    ]);
  } catch (err) {
    error.value = "Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.";
    console.error('Error fetching all data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAllData();
});
</script>

<template>
  <div class="p-4">
    <!-- Header -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Ferma Boshqaruv Tizimi</h1>
        <p class="text-gray-600 mt-1">Statistika va hisobotlar</p>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-3">
        <Calendar 
          v-model="endDate" 
          dateFormat="yy-mm-dd" 
          mask="9999-99-99"
          showIcon 
          @change="fetchAllData"
          class="w-full sm:w-auto"
          placeholder="Sana tanlang"
        />

        <Button 
          label="Yangilash" 
          icon="pi pi-refresh" 
          :loading="loading" 
          @click="fetchAllData" 
          class="p-button-primary"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !generalStats" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <!-- Error State -->
    <Card v-else-if="error" class="p-error mb-6">
      <div class="flex items-center gap-2">
        <i class="pi pi-exclamation-triangle text-red-500 text-xl"></i>
        <span class="text-red-600">{{ error }}</span>
      </div>
    </Card>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Summary Cards -->
      <SummaryCards 
        :generalStats="generalStats" 
        :products="products" 
        :mixes="mixes" 
        :formatCurrency="formatCurrency" 
      />

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card class="lg:col-span-2 p-6">
          <IncomeChart :monthlyStats="monthlyStats" />
        </Card>
        <Card class="lg:col-span-1 p-6">
          <TodayStats 
            :dailyStats="dailyStats" 
            :formatCurrency="formatCurrency" 
          />
        </Card>
      </div>

      <!-- Recent Sales Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSalesTable 
          title="So'nggi mahsulot sotuvlari" 
          :sales="recentProductSales" 
          :formatDate="formatDate" 
          :formatCurrency="formatCurrency"
          iconColor="blue"
          badgeColor="blue"
        />

        <RecentSalesTable 
          title="So'nggi aralashma sotuvlari" 
          :sales="recentMixSales" 
          :formatDate="formatDate" 
          :formatCurrency="formatCurrency"
          iconColor="orange"
          badgeColor="orange"
        />
      </div>
    </div>
  </div>
</template>

<style>
/* Agar kerak bo'lsa PrimeVue global style override qilishingiz mumkin */
</style>
