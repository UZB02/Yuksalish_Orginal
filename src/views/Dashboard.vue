<script setup>
import { ref, onMounted } from 'vue';

import SummaryCards from '../components/dashboard/SummaryCards.vue';
import IncomeChart from '../components/dashboard/IncomeChart.vue';
import RecentSalesTable from '../components/dashboard/RecentSalesTable.vue';
import DebtTable from "@/components/dashboard/DebtTable.vue"

const date = ref(new Date());

</script>

<template>
  <div class="p-4">
    <!-- Header -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Ferma Boshqaruv Tizimi</h1>
        <p class="text-gray-600 mt-1 dark:text-gray-300">Statistika va hisobotlar</p>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-3">
       <DatePicker v-model="date" view="month" dateFormat="mm/yy" />

        <Button 
          label="Yangilash" 
          icon="pi pi-refresh" 
          class="p-button-primary"
        />
      </div>
    </div>
    <!-- Main Content -->
    <div class="space-y-6">
      <!-- Summary Cards -->
      <SummaryCards :date="date"/>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 gap-6">
          <IncomeChart :date="date" />
      </div>

      <!-- Qarzdorlar -->
      <div>
        <DebtTable :date="date"/>
      </div>
      <!-- Recent Sales Tables -->
      <!-- <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <RecentSalesTable :date="date"/>

        <RecentSalesTable :date="date"/>
      </div> -->
    </div>
  </div>
</template>

<style>
/* Agar kerak bo'lsa PrimeVue global style override qilishingiz mumkin */
</style>
