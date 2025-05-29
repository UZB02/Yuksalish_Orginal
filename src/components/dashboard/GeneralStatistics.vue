<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="mb-4">
      <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3">
        <div>
          <h1 class="text-3xl font-bold text-900 m-0">Ferma Boshqaruv Tizimi</h1>
          <p class="text-600 mt-1 mb-0">Statistika va hisobotlar</p>
        </div>
        <div class="flex flex-column md:flex-row gap-2">
          <Calendar 
            v-model="dateRange" 
            selectionMode="range" 
            :manualInput="false" 
            dateFormat="dd.mm.yy" 
            showIcon 
            placeholder="Vaqt oralig'ini tanlang"
            class="w-full md:w-auto"
          />
          <Button 
            label="Yangilash" 
            icon="pi pi-refresh" 
            @click="fetchAllData" 
            :loading="loading"
            class="w-full md:w-auto"
          />
        </div>
      </div>
    </div>

    <div class="grid">
      <!-- Umumiy statistika kartalari -->
      <div class="col-12">
        <div class="grid">
          <div class="col-12 md:col-6 lg:col-3">
            <Card class="bg-blue-50 border-blue-200">
              <template #content>
                <div class="flex align-items-center">
                  <div class="bg-blue-500 text-white border-circle p-3 mr-3">
                    <i class="pi pi-shopping-cart text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <div class="text-500 font-medium mb-1">Jami sotuv</div>
                    <div class="text-900 font-bold text-xl">{{ formatCurrency(generalStats.totalSales) }}</div>
                    <div class="text-green-500 font-medium">
                      <i class="pi pi-arrow-up"></i>
                      +{{ generalStats.salesGrowth }}%
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <div class="col-12 md:col-6 lg:col-3">
            <Card class="bg-green-50 border-green-200">
              <template #content>
                <div class="flex align-items-center">
                  <div class="bg-green-500 text-white border-circle p-3 mr-3">
                    <i class="pi pi-chart-line text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <div class="text-500 font-medium mb-1">Jami foyda</div>
                    <div class="text-900 font-bold text-xl">{{ formatCurrency(generalStats.totalProfit) }}</div>
                    <div class="text-green-500 font-medium">
                      <i class="pi pi-arrow-up"></i>
                      +{{ generalStats.profitGrowth }}%
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <div class="col-12 md:col-6 lg:col-3">
            <Card class="bg-purple-50 border-purple-200">
              <template #content>
                <div class="flex align-items-center">
                  <div class="bg-purple-500 text-white border-circle p-3 mr-3">
                    <i class="pi pi-box text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <div class="text-500 font-medium mb-1">Sotilgan mahsulotlar</div>
                    <div class="text-900 font-bold text-xl">{{ generalStats.totalProductsSold }}</div>
                    <div class="text-blue-500 font-medium">
                      <i class="pi pi-info-circle"></i>
                      {{ generalStats.totalProducts }} ta mavjud
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <div class="col-12 md:col-6 lg:col-3">
            <Card class="bg-orange-50 border-orange-200">
              <template #content>
                <div class="flex align-items-center">
                  <div class="bg-orange-500 text-white border-circle p-3 mr-3">
                    <i class="pi pi-tags text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <div class="text-500 font-medium mb-1">Sotilgan aralashmalar</div>
                    <div class="text-900 font-bold text-xl">{{ generalStats.totalMixesSold }}</div>
                    <div class="text-blue-500 font-medium">
                      <i class="pi pi-info-circle"></i>
                      {{ generalStats.totalMixes }} ta mavjud
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>

      <!-- Vaqt davri filtrlari -->
      <div class="col-12">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span>Vaqt davri bo'yicha ko'rish</span>
              <div class="flex gap-2">
                <Button 
                  v-for="period in timePeriods" 
                  :key="period.value"
                  :label="period.label" 
                  :class="selectedTimePeriod === period.value ? 'p-button-outlined' : 'p-button-text'"
                  @click="selectTimePeriod(period.value)"
                  size="small"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="mb-3">
                  <label class="block text-900 font-medium mb-2">Yil</label>
                  <Dropdown 
                    v-model="selectedYear" 
                    :options="availableYears" 
                    placeholder="Yilni tanlang"
                    @change="updateChartData"
                    class="w-full"
                  />
                </div>
              </div>
              <div class="col-12 md:col-6" v-if="selectedTimePeriod === 'monthly'">
                <div class="mb-3">
                  <label class="block text-900 font-medium mb-2">Oy</label>
                  <Dropdown 
                    v-model="selectedMonth" 
                    :options="months" 
                    optionLabel="name" 
                    optionValue="value"
                    placeholder="Oyni tanlang"
                    @change="updateChartData"
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Daromad va foyda dinamikasi -->
      <div class="col-12 lg:col-8">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span>Daromad va foyda dinamikasi</span>
              <div class="flex align-items-center gap-3">
                <div class="flex align-items-center gap-1">
                  <div class="w-1rem h-1rem bg-blue-500 border-circle"></div>
                  <span class="text-sm">Daromad</span>
                </div>
                <div class="flex align-items-center gap-1">
                  <div class="w-1rem h-1rem bg-green-500 border-circle"></div>
                  <span class="text-sm">Foyda</span>
                </div>
              </div>
            </div>
          </template>
          <template #content>
            <div v-if="loading" class="flex justify-content-center p-4">
              <ProgressSpinner />
            </div>
            <Chart v-else type="line" :data="incomeChartData" :options="chartOptions" height="350px" />
          </template>
        </Card>
      </div>

      <!-- Tezkor ko'rsatkichlar -->
      <div class="col-12 lg:col-4">
        <Card>
          <template #title>Bugungi ko'rsatkichlar</template>
          <template #content>
            <div class="flex flex-column gap-3">
              <div class="border-1 border-200 border-round p-3">
                <div class="flex align-items-center justify-content-between">
                  <div>
                    <div class="text-500 text-sm">Bugungi sotuv</div>
                    <div class="text-900 font-bold">{{ formatCurrency(todayStats.sales) }}</div>
                  </div>
                  <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                </div>
              </div>
              
              <div class="border-1 border-200 border-round p-3">
                <div class="flex align-items-center justify-content-between">
                  <div>
                    <div class="text-500 text-sm">Bugungi foyda</div>
                    <div class="text-900 font-bold">{{ formatCurrency(todayStats.profit) }}</div>
                  </div>
                  <i class="pi pi-chart-line text-green-500 text-xl"></i>
                </div>
              </div>
              
              <div class="border-1 border-200 border-round p-3">
                <div class="flex align-items-center justify-content-between">
                  <div>
                    <div class="text-500 text-sm">Bugungi buyurtmalar</div>
                    <div class="text-900 font-bold">{{ todayStats.orders }}</div>
                  </div>
                  <i class="pi pi-list text-purple-500 text-xl"></i>
                </div>
              </div>
              
              <div class="border-1 border-200 border-round p-3">
                <div class="flex align-items-center justify-content-between">
                  <div>
                    <div class="text-500 text-sm">Faol mijozlar</div>
                    <div class="text-900 font-bold">{{ todayStats.activeCustomers }}</div>
                  </div>
                  <i class="pi pi-users text-orange-500 text-xl"></i>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Mahsulotlar bo'yicha statistika -->
      <div class="col-12 lg:col-6">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span>Mahsulotlar bo'yicha statistika</span>
              <Dropdown 
                v-model="selectedProduct" 
                :options="products" 
                optionLabel="name" 
                optionValue="id" 
                placeholder="Mahsulot tanlang"
                @change="fetchProductStats"
                class="w-12rem"
              />
            </div>
          </template>
          <template #content>
            <Chart type="bar" :data="productChartData" :options="barChartOptions" height="300px" />
            <div class="grid mt-3">
              <div class="col-4">
                <div class="text-center">
                  <div class="text-500 text-sm">Sotilgan</div>
                  <div class="text-900 font-bold">{{ productStats.totalQuantity }} kg</div>
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  <div class="text-500 text-sm">Daromad</div>
                  <div class="text-900 font-bold">{{ formatCurrency(productStats.totalSales) }}</div>
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  <div class="text-500 text-sm">O'rtacha narx</div>
                  <div class="text-900 font-bold">{{ formatCurrency(productStats.averagePrice) }}</div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Aralashmalar bo'yicha statistika -->
      <div class="col-12 lg:col-6">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span>Aralashmalar bo'yicha statistika</span>
              <Dropdown 
                v-model="selectedMix" 
                :options="mixes" 
                optionLabel="title" 
                optionValue="id" 
                placeholder="Aralashma tanlang"
                @change="fetchMixStats"
                class="w-12rem"
              />
            </div>
          </template>
          <template #content>
            <Chart type="bar" :data="mixChartData" :options="barChartOptions" height="300px" />
            <div class="grid mt-3">
              <div class="col-4">
                <div class="text-center">
                  <div class="text-500 text-sm">Sotilgan</div>
                  <div class="text-900 font-bold">{{ mixStats.totalQuantity }} kg</div>
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  <div class="text-500 text-sm">Daromad</div>
                  <div class="text-900 font-bold">{{ formatCurrency(mixStats.totalSales) }}</div>
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  <div class="text-500 text-sm">O'rtacha narx</div>
                  <div class="text-900 font-bold">{{ formatCurrency(mixStats.averagePrice) }}</div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Eng ko'p sotilgan mahsulotlar -->
      <div class="col-12 lg:col-6">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span>Eng ko'p sotilgan mahsulotlar</span>
              <Badge :value="topProducts.length" severity="info" />
            </div>
          </template>
          <template #content>
            <DataTable :value="topProducts" :rows="5" :paginator="true" responsiveLayout="scroll">
              <Column field="name" header="Mahsulot nomi" sortable>
                <template #body="{ data }">
                  <div class="flex align-items-center gap-2">
                    <Avatar icon="pi pi-box" class="mr-2" size="small" style="background-color: #dee2e6; color: #495057" />
                    <span class="font-medium">{{ data.name }}</span>
                  </div>
                </template>
              </Column>
              <Column field="quantity" header="Miqdor (kg)" sortable>
                <template #body="{ data }">
                  <Tag :value="formatNumber(data.quantity) + ' kg'" severity="info" />
                </template>
              </Column>
              <Column field="totalSales" header="Sotuvlar" sortable />
              <Column field="income" header="Daromad" sortable>
                <template #body="{ data }">
                  <span class="font-bold text-green-600">{{ formatCurrency(data.income) }}</span>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <!-- Eng ko'p sotilgan aralashmalar -->
      <div class="col-12 lg:col-6">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span>Eng ko'p sotilgan aralashmalar</span>
              <Badge :value="topMixes.length" severity="warning" />
            </div>
          </template>
          <template #content>
            <DataTable :value="topMixes" :rows="5" :paginator="true" responsiveLayout="scroll">
              <Column field="title" header="Aralashma nomi" sortable>
                <template #body="{ data }">
                  <div class="flex align-items-center gap-2">
                    <Avatar icon="pi pi-tags" class="mr-2" size="small" style="background-color: #fff3cd; color: #856404" />
                    <span class="font-medium">{{ data.title }}</span>
                  </div>
                </template>
              </Column>
              <Column field="quantity" header="Miqdor (kg)" sortable>
                <template #body="{ data }">
                  <Tag :value="formatNumber(data.quantity) + ' kg'" severity="warning" />
                </template>
              </Column>
              <Column field="totalSales" header="Sotuvlar" sortable />
              <Column field="income" header="Daromad" sortable>
                <template #body="{ data }">
                  <span class="font-bold text-green-600">{{ formatCurrency(data.income) }}</span>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <!-- So'nggi operatsiyalar -->
      <div class="col-12">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span>So'nggi operatsiyalar</span>
              <div class="flex gap-2">
                <Button 
                  :label="showRecentProducts ? 'Mahsulotlar' : 'Aralashmalar'" 
                  :icon="showRecentProducts ? 'pi pi-box' : 'pi pi-tags'"
                  @click="showRecentProducts = !showRecentProducts"
                  class="p-button-outlined p-button-sm"
                />
              </div>
            </div>
          </template>
          <template #content>
            <DataTable 
              :value="showRecentProducts ? recentProductSales : recentMixSales" 
              :rows="10" 
              :paginator="true" 
              responsiveLayout="scroll"
              :loading="loading"
            >
              <Column field="date" header="Sana" sortable>
                <template #body="{ data }">
                  <span class="text-sm">{{ data.date }}</span>
                </template>
              </Column>
              <Column :field="showRecentProducts ? 'productName' : 'mixTitle'" :header="showRecentProducts ? 'Mahsulot' : 'Aralashma'" sortable>
                <template #body="{ data }">
                  <div class="flex align-items-center gap-2">
                    <Avatar 
                      :icon="showRecentProducts ? 'pi pi-box' : 'pi pi-tags'" 
                      size="small" 
                      :style="showRecentProducts ? 'background-color: #e3f2fd; color: #1976d2' : 'background-color: #fff3e0; color: #f57c00'"
                    />
                    <span class="font-medium">{{ showRecentProducts ? data.productName : data.mixTitle }}</span>
                  </div>
                </template>
              </Column>
              <Column field="quantity" header="Miqdor" sortable>
                <template #body="{ data }">
                  <Tag :value="data.quantity + ' kg'" severity="info" />
                </template>
              </Column>
              <Column field="price" header="Narx" sortable>
                <template #body="{ data }">
                  <span class="font-medium">{{ formatCurrency(data.price) }}</span>
                </template>
              </Column>
              <Column field="total" header="Jami" sortable>
                <template #body="{ data }">
                  <span class="font-bold text-green-600">{{ formatCurrency(data.total) }}</span>
                </template>
              </Column>
              <Column header="Holat">
                <template #body>
                  <Tag value="Yakunlangan" severity="success" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';

export default {
  name: 'StatistikaDashboard',
  setup() {
    // Asosiy o'zgaruvchilar
    const baseUrl = 'https://yuksalish-node-lwj4.onrender.com/api';
    const token = ref(sessionStorage.getItem('authToken') || 'your_jwt_token_here');
    
    const loading = ref(true);
    const dateRange = ref([new Date(), new Date()]);
    const selectedTimePeriod = ref('monthly');
    const selectedYear = ref(new Date().getFullYear());
    const selectedMonth = ref(new Date().getMonth() + 1);
    const selectedProduct = ref(null);
    const selectedMix = ref(null);
    const showRecentProducts = ref(true);

    // Vaqt davrlari
    const timePeriods = [
      { value: 'daily', label: 'Kunlik' },
      { value: 'monthly', label: 'Oylik' },
      { value: 'yearly', label: 'Yillik' }
    ];

    const availableYears = [2021, 2022, 2023, 2024, 2025];
    const months = [
      { name: 'Yanvar', value: 1 },
      { name: 'Fevral', value: 2 },
      { name: 'Mart', value: 3 },
      { name: 'Aprel', value: 4 },
      { name: 'May', value: 5 },
      { name: 'Iyun', value: 6 },
      { name: 'Iyul', value: 7 },
      { name: 'Avgust', value: 8 },
      { name: 'Sentabr', value: 9 },
      { name: 'Oktabr', value: 10 },
      { name: 'Noyabr', value: 11 },
      { name: 'Dekabr', value: 12 }
    ];

    // Ma'lumotlar
    const generalStats = ref({
      totalSales: 125000000,
      salesGrowth: 15,
      totalProfit: 48000000,
      profitGrowth: 12,
      totalProductsSold: 156,
      totalProducts: 24,
      totalMixesSold: 89,
      totalMixes: 12
    });

    const todayStats = ref({
      sales: 2500000,
      profit: 950000,
      orders: 12,
      activeCustomers: 8
    });

    const products = ref([
      { id: 1, name: 'Arpa' },
      { id: 2, name: 'Bug\'doy' },
      { id: 3, name: 'Makkajo\'xori' },
      { id: 4, name: 'Soya' },
      { id: 5, name: 'Beda' }
    ]);

    const mixes = ref([
      { id: 1, title: 'Mol yemi' },
      { id: 2, title: 'Qo\'y yemi' },
      { id: 3, title: 'Tovuq yemi' },
      { id: 4, title: 'Ot yemi' },
      { id: 5, title: 'Baliq yemi' }
    ]);

    const topProducts = ref([
      { name: 'Arpa', quantity: 1200, totalSales: 45, income: 6000000 },
      { name: 'Bug\'doy', quantity: 950, totalSales: 38, income: 5700000 },
      { name: 'Makkajo\'xori', quantity: 850, totalSales: 32, income: 4250000 },
      { name: 'Soya', quantity: 600, totalSales: 25, income: 3600000 },
      { name: 'Beda', quantity: 450, totalSales: 18, income: 2250000 }
    ]);

    const topMixes = ref([
      { title: 'Mol yemi', quantity: 800, totalSales: 40, income: 6400000 },
      { title: 'Qo\'y yemi', quantity: 650, totalSales: 32, income: 5200000 },
      { title: 'Tovuq yemi', quantity: 500, totalSales: 25, income: 4000000 },
      { title: 'Ot yemi', quantity: 350, totalSales: 18, income: 2800000 },
      { title: 'Baliq yemi', quantity: 200, totalSales: 10, income: 1600000 }
    ]);

    const recentProductSales = ref([
      { date: '28.05.2024', productName: 'Arpa', quantity: 50, price: 5000, total: 250000 },
      { date: '28.05.2024', productName: 'Bug\'doy', quantity: 30, price: 6000, total: 180000 },
      { date: '27.05.2024', productName: 'Soya', quantity: 25, price: 8000, total: 200000 },
      { date: '27.05.2024', productName: 'Makkajo\'xori', quantity: 40, price: 4500, total: 180000 },
      { date: '26.05.2024', productName: 'Beda', quantity: 20, price: 7000, total: 140000 }
    ]);

    const recentMixSales = ref([
      { date: '28.05.2024', mixTitle: 'Mol yemi', quantity: 100, price: 8000, total: 800000 },
      { date: '28.05.2024', mixTitle: 'Qo\'y yemi', quantity: 80, price: 7500, total: 600000 },
      { date: '27.05.2024', mixTitle: 'Tovuq yemi', quantity: 60, price: 9000, total: 540000 },
      { date: '27.05.2024', mixTitle: 'Ot yemi', quantity: 45, price: 8500, total: 382500 },
      { date: '26.05.2024', mixTitle: 'Baliq yemi', quantity: 30, price: 10000, total: 300000 }
    ]);

    const productStats = ref({
      totalQuantity: 1200,
      totalSales: 6000000,
      averagePrice: 5000
    });

    const mixStats = ref({
      totalQuantity: 800,
      totalSales: 6400000,
      averagePrice: 8000
    });

    // Chart ma'lumotlari
    const incomeChartData = ref({
      labels: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun'],
      datasets: [
        {
          label: 'Daromad',
          data: [8500000, 7800000, 9200000, 10500000, 11800000, 12500000],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Foyda',
          data: [3200000, 2900000, 3500000, 4100000, 4600000, 4800000],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    });

    const productChartData = ref({
      labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun'],
      datasets: [
        {
          label: 'Sotuvlar',
          data: [200, 180, 220, 250, 280, 300],
          backgroundColor: '#3B82F6',
          borderRadius: 4
        }
      ]
    });

    const mixChartData = ref({
      labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun'],
      datasets: [
        {
          label: 'Sotuvlar',
          data: [150, 140, 160, 180, 200, 220],
          backgroundColor: '#F59E0B',
          borderRadius: 4
        }
      ]
    });

    // Chart opsiyalari
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
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
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    });

    const barChartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Sotuvlar: ${context.raw} kg`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    });

    // Yordamchi funksiyalar
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    };

    const formatNumber = (value) => {
      return new Intl.NumberFormat('uz-UZ').format(value);
    };

    const selectTimePeriod = (period) => {
      selectedTimePeriod.value = period;
      updateChartData();
    };

    const updateChartData = () => {
      // Bu yerda API dan ma'lumotlarni yangilash kerak
      console.log('Updating chart data for:', selectedTimePeriod.value, selectedYear.value, selectedMonth.value);
    };

    // API funksiyalari
    const fetchGeneralStats = async () => {
      try {
        // API chaqiruvi
        console.log('Fetching general stats...');
      } catch (error) {
        console.error('Error fetching general stats:', error);
      }
    };

    const fetchProductStats = async () => {
      if (!selectedProduct.value) return;
      try {
        // API chaqiruvi
        console.log('Fetching product stats for:', selectedProduct.value);
      } catch (error) {
        console.error('Error fetching product stats:', error);
      }
    };

    const fetchMixStats = async () => {
      if (!selectedMix.value) return;
      try {
        // API chaqiruvi
        console.log('Fetching mix stats for:', selectedMix.value);
      } catch (error) {
        console.error('Error fetching mix stats:', error);
      }
    };

    const fetchAllData = async () => {
      loading.value = true;
      try {
        await Promise.all([
          fetchGeneralStats(),
          // Boshqa API chaqiruvlari
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        loading.value = false;
      }
    };

    // Watchers
    watch(selectedProduct, fetchProductStats);
    watch(selectedMix, fetchMixStats);
    watch(dateRange, () => {
      console.log('Date range changed:', dateRange.value);
      fetchAllData();
    });

    // Mounted
    onMounted(() => {
      if (products.value.length > 0) {
        selectedProduct.value = products.value[0].id;
      }
      if (mixes.value.length > 0) {
        selectedMix.value = mixes.value[0].id;
      }
      fetchAllData();
    });

    return {
      loading,
      dateRange,
      selectedTimePeriod,
      selectedYear,
      selectedMonth,
      selectedProduct,
      selectedMix,
      showRecentProducts,
      timePeriods,
      availableYears,
      months,
      generalStats,
      todayStats,
      products,
      mixes,
      topProducts,
      topMixes,
      recentProductSales,
      recentMixSales,
      productStats,
      mixStats,
      incomeChartData,
      productChartData,
      mixChartData,
      chartOptions,
      barChartOptions,
      formatCurrency,
      formatNumber,
      selectTimePeriod,
      updateChartData,
      fetchAllData,
      fetchProductStats,
      fetchMixStats
    };
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 1.5rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.col-12 { grid-column: span 12; }
.col-6 { grid-column: span 6; }
.col-4 { grid-column: span 4; }
.col-3 { grid-column: span 3; }

@media (min-width: 768px) {
  .md\:col-6 { grid-column: span 6; }
  .md\:col-4 { grid-column: span 4; }
  .md\:col-3 { grid-column: span 3; }
}

@media (min-width: 992px) {
  .lg\:col-8 { grid-column: span 8; }
  .lg\:col-6 { grid-column: span 6; }
  .lg\:col-4 { grid-column: span 4; }
  .lg\:col-3 { grid-column: span 3; }
}

.border-circle {
  border-radius: 50%;
}

.text-xl {
  font-size: 1.25rem;
}

.text-3xl {
  font-size: 1.875rem;
}

.font-bold {
  font-weight: 700;
}

.font-medium {
  font-weight: 500;
}

.text-900 {
  color: #212529;
}

.text-600 {
  color: #6c757d;
}

.text-500 {
  color: #adb5bd;
}

.text-sm {
  font-size: 0.875rem;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.border-blue-200 {
  border-color: #bfdbfe;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

.border-green-200 {
  border-color: #bbf7d0;
}

.bg-purple-50 {
  background-color: #faf5ff;
}

.border-purple-200 {
  border-color: #e9d5ff;
}

.bg-orange-50 {
  background-color: #fff7ed;
}

.border-orange-200 {
  border-color: #fed7aa;
}

.text-green-500 {
  color: #10b981;
}

.text-blue-500 {
  color: #3b82f6;
}

.text-green-600 {
  color: #059669;
}

.w-1rem {
  width: 1rem;
}

.h-1rem {
  height: 1rem;
}

.w-12rem {
  width: 12rem;
}

.gap-1 {
  gap: 0.25rem;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}

.p-3 {
  padding: 0.75rem;
}

.p-4 {
  padding: 1rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mr-3 {
  margin-right: 0.75rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.m-0 {
  margin: 0;
}

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-1 {
  flex: 1;
}

.align-items-center {
  align-items: center;
}

.justify-content-between {
  justify-content: space-between;
}

.justify-content-center {
  justify-content: center;
}

.text-center {
  text-align: center;
}

.block {
  display: block;
}

.w-full {
  width: 100%;
}

.border-1 {
  border-width: 1px;
}

.border-200 {
  border-color: #e5e7eb;
}

.border-round {
  border-radius: 0.375rem;
}

@media (max-width: 767px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .flex-column {
    flex-direction: column;
  }
  
  .md\:flex-row {
    flex-direction: column;
  }
  
  .md\:w-auto {
    width: 100%;
  }
}

@media (min-width: 768px) {
  .md\:flex-row {
    flex-direction: row;
  }
  
  .md\:align-items-center {
    align-items: center;
  }
  
  .md\:justify-content-between {
    justify-content: space-between;
  }
  
  .md\:w-auto {
    width: auto;
  }
}
</style>