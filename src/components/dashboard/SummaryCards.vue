<script setup>
import { defineProps } from 'vue';

defineProps({
  generalStats: Object,
  products: Array,
  mixes: Array,
  formatCurrency: Function
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Sales -->
    <Card>
      <template #content>
        <div class="flex items-center">
          <Avatar icon="pi pi-dollar" class="bg-blue-100 text-blue-600 mr-4" size="large" />
          <div class="flex-1">
            <div class="text-sm text-gray-600">Jami sotuv</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ formatCurrency(generalStats?.totalSales || 0) }}
            </div>
            <div class="text-sm text-green-600 mt-1 flex items-center">
              <i class="pi pi-arrow-up mr-1"></i> +{{ generalStats?.salesGrowth || 0 }}%
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Total Profit -->
    <Card>
      <template #content>
        <div class="flex items-center">
          <Avatar icon="pi pi-chart-line" class="bg-green-100 text-green-600 mr-4" size="large" />
          <div class="flex-1">
            <div class="text-sm text-gray-600">Jami foyda</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ formatCurrency(generalStats?.totalProfit || 0) }}
            </div>
            <div class="text-sm text-green-600 mt-1 flex items-center">
              <i class="pi pi-arrow-up mr-1"></i> +{{ generalStats?.profitGrowth || 0 }}%
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Products Sold -->
    <Card>
      <template #content>
        <div class="flex items-center">
          <Avatar icon="pi pi-box" class="bg-purple-100 text-purple-600 mr-4" size="large" />
          <div class="flex-1">
            <div class="text-sm text-gray-600">Sotilgan mahsulotlar</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ generalStats?.totalProductsSold || 0 }}
            </div>
            <div class="text-sm text-blue-600 mt-1">{{ products.length }} ta mavjud</div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Mixes Sold -->
    <Card>
      <template #content>
        <div class="flex items-center">
          <Avatar icon="pi pi-th-large" class="bg-orange-100 text-orange-600 mr-4" size="large" />
          <div class="flex-1">
            <div class="text-sm text-gray-600">Sotilgan aralashmalar</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ generalStats?.totalMixesSold || 0 }}
            </div>
            <div class="text-sm text-blue-600 mt-1">{{ mixes.length }} ta mavjud</div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.pi {
  font-size: 1rem;
}
</style>
