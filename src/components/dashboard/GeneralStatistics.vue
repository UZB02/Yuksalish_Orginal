<template>
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
          <!-- Qolgan statistikalar -->
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
defineProps({
  loading: Boolean,
  generalStats: Object,
  dateRange: Array
});

const emit = defineEmits(['date-change']);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS' }).format(value);
};
</script>