<template>
  <div class="min-h-screen bg-gray-50 p-4 lg:p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Ferma Boshqaruv Tizimi</h1>
          <p class="text-gray-600 mt-1">Statistika va hisobotlar</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative">
            <input
              type="date"
              v-model="startDate"
              @change="fetchAllData"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-2.5 text-gray-400">dan</span>
          </div>
          <div class="relative">
            <input
              type="date"
              v-model="endDate"
              @change="fetchAllData"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-2.5 text-gray-400">gacha</span>
          </div>
          <button
            @click="fetchAllData"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Yuklanmoqda...' : 'Yangilash' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !generalStats" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Ma'lumotlar yuklanmoqda...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">Jami sotuv</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(generalStats?.totalSales || 0) }}</p>
              <p class="text-sm text-green-600 flex items-center mt-1">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                </svg>
                +{{ generalStats?.salesGrowth || 0 }}%
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">Jami foyda</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(generalStats?.totalProfit || 0) }}</p>
              <p class="text-sm text-green-600 flex items-center mt-1">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                </svg>
                +{{ generalStats?.profitGrowth || 0 }}%
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">Sotilgan mahsulotlar</p>
              <p class="text-2xl font-bold text-gray-900">{{ generalStats?.totalProductsSold || 0 }}</p>
              <p class="text-sm text-blue-600">{{ products.length }} ta mavjud</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100">
              <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">Sotilgan aralashmalar</p>
              <p class="text-2xl font-bold text-gray-900">{{ generalStats?.totalMixesSold || 0 }}</p>
              <p class="text-sm text-blue-600">{{ mixes.length }} ta mavjud</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Income Chart -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Daromad va foyda dinamikasi</h3>
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600">Daromad</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600">Foyda</span>
              </div>
            </div>
          </div>
          <div class="h-80">
            <canvas ref="incomeChart" class="w-full h-full"></canvas>
          </div>
        </div>

        <!-- Today's Stats -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Bugungi ko'rsatkichlar</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p class="text-sm text-gray-600">Bugungi sotuv</p>
                <p class="text-lg font-bold text-gray-900">{{ formatCurrency(dailyStats?.totalSales || 0) }}</p>
              </div>
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>

            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p class="text-sm text-gray-600">Bugungi foyda</p>
                <p class="text-lg font-bold text-gray-900">{{ formatCurrency(dailyStats?.profit || 0) }}</p>
              </div>
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>

            <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p class="text-sm text-gray-600">Bugungi buyurtmalar</p>
                <p class="text-lg font-bold text-gray-900">{{ dailyStats?.totalOrders || 0 }}</p>
              </div>
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product and Mix Statistics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Product Statistics -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Mahsulotlar statistikasi</h3>
            <select
              v-model="selectedProduct"
              @change="fetchProductStats"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Mahsulot tanlang</option>
              <option v-for="product in products" :key="product._id" :value="product._id">
                {{ product.name }}
              </option>
            </select>
          </div>
          <div v-if="selectedProduct" class="space-y-4">
            <div class="h-64">
              <canvas ref="productChart" class="w-full h-full"></canvas>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">Sotilgan</p>
                <p class="text-lg font-bold text-gray-900">{{ productStats?.totalQuantity || 0 }} kg</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">Daromad</p>
                <p class="text-lg font-bold text-gray-900">{{ formatCurrency(productStats?.totalSales || 0) }}</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">O'rtacha narx</p>
                <p class="text-lg font-bold text-gray-900">{{ formatCurrency(productStats?.averagePrice || 0) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            Mahsulot tanlang
          </div>
        </div>

        <!-- Mix Statistics -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Aralashmalar statistikasi</h3>
            <select
              v-model="selectedMix"
              @change="fetchMixStats"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Aralashma tanlang</option>
              <option v-for="mix in mixes" :key="mix._id" :value="mix._id">
                {{ mix.title }}
              </option>
            </select>
          </div>
          <div v-if="selectedMix" class="space-y-4">
            <div class="h-64">
              <canvas ref="mixChart" class="w-full h-full"></canvas>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">Sotilgan</p>
                <p class="text-lg font-bold text-gray-900">{{ mixStats?.totalQuantity || 0 }} kg</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">Daromad</p>
                <p class="text-lg font-bold text-gray-900">{{ formatCurrency(mixStats?.totalSales || 0) }}</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">O'rtacha narx</p>
                <p class="text-lg font-bold text-gray-900">{{ formatCurrency(mixStats?.averagePrice || 0) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            Aralashma tanlang
          </div>
        </div>
      </div>

      <!-- Recent Sales Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Product Sales -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">So'nggi mahsulot sotuvlari</h3>
            <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {{ recentProductSales.length }} ta
            </span>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sana</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mahsulot</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miqdor</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jami</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="sale in recentProductSales" :key="sale._id" class="hover:bg-gray-50">
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(sale.createdAt) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                      </div>
                      <span class="text-sm font-medium text-gray-900">{{ sale.name }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {{ sale.size }} kg
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    {{ formatCurrency(sale.totalPrice) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Mix Sales -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">So'nggi aralashma sotuvlari</h3>
            <span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
              {{ recentMixSales.length }} ta
            </span>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sana</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aralashma</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miqdor</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jami</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="sale in recentMixSales" :key="sale._id" class="hover:bg-gray-50">
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(sale.createdAt) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                        <svg class="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                      </div>
                      <span class="text-sm font-medium text-gray-900">{{ sale.title }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                      {{ sale.size }} kg
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    {{ formatCurrency(sale.totalPrice) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';

// API Configuration
const baseUrl = 'https://yuksalish-node-lwj4.onrender.com/api';
const token = ref(sessionStorage.getItem('authToken') || localStorage.getItem('authToken') || '');

// State
const loading = ref(false);
const error = ref('');
const startDate = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);

// Data
const generalStats = ref(null);
const dailyStats = ref(null);
const monthlyStats = ref([]);
const products = ref([]);
const mixes = ref([]);
const selectedProduct = ref('');
const selectedMix = ref('');
const productStats = ref(null);
const mixStats = ref(null);
const recentProductSales = ref([]);
const recentMixSales = ref([]);

// Chart refs
const incomeChart = ref(null);
const productChart = ref(null);
const mixChart = ref(null);

// Helper functions
const formatCurrency = (value) => {
  if (!value) return '0 so\'m';
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('uz-UZ');
};

const makeRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`API Error for ${endpoint}:`, err);
    throw err;
  }
};

// Chart drawing functions
const drawLineChart = (canvas, data) => {
  if (!canvas || !data.length) return;

  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  
  ctx.clearRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const maxSales = Math.max(...data.map(d => d.totalSales || 0));
  const maxProfit = Math.max(...data.map(d => d.profit || 0));
  const maxValue = Math.max(maxSales, maxProfit);
  
  if (maxValue === 0) return;
  
  // Draw grid
  ctx.strokeStyle = '#f3f4f6';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  
  // Draw sales line
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((point, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index;
    const y = padding + chartHeight - ((point.totalSales || 0) / maxValue) * chartHeight;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
  
  // Draw profit line
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((point, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index;
    const y = padding + chartHeight - ((point.profit || 0) / maxValue) * chartHeight;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
  
  // Draw points and labels
  ctx.fillStyle = '#374151';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  data.forEach((point, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index;
    
    // Sales point
    const salesY = padding + chartHeight - ((point.totalSales || 0) / maxValue) * chartHeight;
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(x, salesY, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Profit point
    const profitY = padding + chartHeight - ((point.profit || 0) / maxValue) * chartHeight;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(x, profitY, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Label
    ctx.fillStyle = '#6b7280';
    const label = point.month ? `${point.month}-oy` : `${index + 1}`;
    ctx.fillText(label, x, height - 20);
  });
};

const drawBarChart = (canvas, data, color = '#3b82f6') => {
  if (!canvas || !data.length) return;

  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  
  ctx.clearRect(0, 0, width, height);
  
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const maxValue = Math.max(...data.map(d => d.value || 0));
  if (maxValue === 0) return;
  
  const barWidth = chartWidth / data.length * 0.8;
  const barSpacing = chartWidth / data.length * 0.2;
  
  data.forEach((item, index) => {
    const x = padding + index * (chartWidth / data.length) + barSpacing / 2;
    const barHeight = ((item.value || 0) / maxValue) * chartHeight;
    const y = padding + chartHeight - barHeight;
    
    // Draw bar
    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Draw label
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x + barWidth / 2, height - 10);
    
    // Draw value
    ctx.fillStyle = '#374151';
    ctx.font = '10px sans-serif';
    if (barHeight > 20) {
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);
    }
  });
};

// API functions
const fetchGeneralStats = async () => {
  try {
    const data = await makeRequest('/statistics');
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
    const today = new Date().toISOString().split('T')[0];
    const data = await makeRequest(`/statistics/daily?date=${today}`);
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
    const year = new Date().getFullYear();
    const data = await makeRequest(`/statistics/yearly?year=${year}`);
    monthlyStats.value = Array.isArray(data) ? data : [];
    
    await nextTick();
    if (incomeChart.value) {
      drawLineChart(incomeChart.value, monthlyStats.value);
    }
  } catch (err) {
    console.error('Error fetching monthly stats:', err);
  }
};

const fetchProducts = async () => {
  try {
    const data = await makeRequest('/product');
    products.value = Array.isArray(data) ? data : [];
    if (products.value.length > 0 && !selectedProduct.value) {
      selectedProduct.value = products.value[0]._id;
    }
  } catch (err) {
    console.error('Error fetching products:', err);
  }
};

const fetchMixes = async () => {
  try {
    const data = await makeRequest('/mix');
    mixes.value = Array.isArray(data) ? data : [];
    if (mixes.value.length > 0 && !selectedMix.value) {
      selectedMix.value = mixes.value[0]._id;
    }
  } catch (err) {
    console.error('Error fetching mixes:', err);
  }
};

const fetchProductStats = async () => {
  if (!selectedProduct.value) return;
  
  try {
    const data = await makeRequest(`/statistics/product/${selectedProduct.value}?startDate=${startDate.value}&endDate=${endDate.value}`);
    productStats.value = {
      totalQuantity: data.totalQuantity || 0,
      totalSales: data.totalSales || 0,
      averagePrice: data.averagePrice || 0
    };
    
    const chartData = data.monthlySales || [];
    const formattedData = chartData.map((value, index) => ({
      label: `${index + 1}`,
      value: value || 0
    }));
    
    await nextTick();
    if (productChart.value) {
      drawBarChart(productChart.value, formattedData, '#3b82f6');
    }
  } catch (err) {
    console.error('Error fetching product stats:', err);
  }
};

const fetchMixStats = async () => {
  if (!selectedMix.value) return;
  
  try {
    const data = await makeRequest(`/statistics/mix/${selectedMix.value}?startDate=${startDate.value}&endDate=${endDate.value}`);
    mixStats.value = {
      totalQuantity: data.totalQuantity || 0,
      totalSales: data.totalSales || 0,
      averagePrice: data.averagePrice || 0
    };
    
    const chartData = data.monthlySales || [];
    const formattedData = chartData.map((value, index) => ({
      label: `${index + 1}`,
      value: value || 0
    }));
    
    await nextTick();
    if (mixChart.value) {
      drawBarChart(mixChart.value, formattedData, '#f59e0b');
    }
  } catch (err) {
    console.error('Error fetching mix stats:', err);
  }
};

const fetchRecentSales = async () => {
  try {
    // Recent product sales
    const productData = await makeRequest('/product-history?limit=10');
    recentProductSales.value = Array.isArray(productData) ? productData : [];
    
    // Recent mix sales
    const mixData = await makeRequest('/mix-history?limit=10');
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
    error.value = 'Ma\'lumotlarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.';
    console.error('Error fetching all data:', err);
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(selectedProduct, () => {
  if (selectedProduct.value) {
    fetchProductStats();
  }
});

watch(selectedMix, () => {
  if (selectedMix.value) {
    fetchMixStats();
  }
});

// Lifecycle
onMounted(() => {
  fetchAllData();
});
</script>