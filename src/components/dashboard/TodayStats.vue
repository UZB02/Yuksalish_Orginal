<script setup>
import { defineProps } from 'vue'

defineProps({
  dailyStats: Object,
  formatCurrency: Function
});
</script>

<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Oylik ko'rsatkichlar</h3>
    
    <div class="grid gap-3 md:grid-cols-3">
      <!-- Oylik Sotuv -->
      <Card class="shadow-sm border border-blue-100">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Oylik sotuv</p>
              <p class="text-xl font-bold text-gray-900">
                {{ formatCurrency(dailyStats?.totalSales || 0) }}
              </p>
            </div>
            <Avatar class="bg-blue-100 text-blue-600" shape="circle" size="large">
              <i class="pi pi-wallet text-lg"></i>
            </Avatar>
          </div>
        </template>
      </Card>

      <!-- Oylik Foyda -->
      <Card class="shadow-sm border border-green-100">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Oylik foyda</p>
              <p class="text-xl font-bold text-gray-900">
                {{ formatCurrency(dailyStats?.profit || 0) }}
              </p>
            </div>
            <Avatar class="bg-green-100 text-green-600" shape="circle" size="large">
              <i class="pi pi-chart-line text-lg"></i>
            </Avatar>
          </div>
        </template>
      </Card>

      <!-- Oylik Buyurtmalar -->
      <Card class="shadow-sm border border-purple-100">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Oylik buyurtmalar</p>
              <p class="text-xl font-bold text-gray-900">
                {{ dailyStats?.totalOrders || 0 }}
              </p>
            </div>
            <Avatar class="bg-purple-100 text-purple-600" shape="circle" size="large">
              <i class="pi pi-shopping-bag text-lg"></i>
            </Avatar>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
