<script setup>
import formatCurrency from '@/utils/PriceFormatter';
import axios from 'axios';
import { defineProps, onMounted,ref , watch} from 'vue';

const data = ref({});
const combinedStats = ref({});
const mixStats = ref({});
const productStats = ref({});
 

const props = defineProps({
  date: {
    type: Date,
    required: true
  }
});
// 🛠 getData faqat props.date asosida ishlaydi
const getData = async () => {
  try {
    const year = props.date.getFullYear();
    const month = props.date.getMonth() + 1;

    const res = await axios.get(`/api/statistics/monthly?year=${year}&month=${month}`);
    data.value = res.data;
    combinedStats.value = res.data.combinedStats;
    mixStats.value = res.data.mixStats;
    productStats.value = res.data.productStats;
  } catch (error) {
    console.error('Xatolik:', error);
  }
};

// ✅ Component yuklanganda so‘rov yuborish
onMounted(() => {
  getData();
});

// ✅ date o‘zgarsa, yana fetch qilish
watch(() => props.date, () => {
  getData();
});



</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Total Sales -->
        <Card class="rounded">
            <template #content>
                <div class="flex items-center">
                    <Avatar icon="pi pi-dollar" class="bg-blue-100 text-blue-600 mr-4" size="large" />
                    <div class="flex-1">
                        <div class="text-sm text-gray-600 dark:text-gray-300">Jami sotuv</div>
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">
                            {{ combinedStats?.totalSoldAmount != null ? formatCurrency(combinedStats.totalSoldAmount) : 'Loading...' }}
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="text-sm text-blue-600 mt-1">{{ combinedStats.totalKgSold ? combinedStats.totalKgSold : 'Loading...' }} Kg</div>
                            <div class="text-sm text-blue-600 mt-1">{{ combinedStats.totalSalesCount ? combinedStats.totalSalesCount : 'Loading...' }} ta sotuv</div>
                        </div>
                    </div>
                </div>
            </template>
        </Card>

        <!-- Total Profit -->
        <!-- <Card>
      <template #content>
        <div class="flex items-center">
          <Avatar icon="pi pi-chart-line" class="bg-green-100 text-green-600 mr-4" size="large" />
          <div class="flex-1">
            <div class="text-sm text-gray-600 dark:text-gray-300">Jami foyda</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
             {{ formatCurrency(50000) }}
            </div>
            <div class="text-sm text-green-600 mt-1 flex items-center">
              <i class="pi pi-arrow-up mr-1"></i> +70%
            </div>
          </div>
        </div>
      </template>
    </Card> -->

        <!-- Products Sold -->
        <Card>
            <template #content>
                <div class="flex items-center">
                    <Avatar icon="pi pi-box" class="bg-purple-100 text-purple-600 mr-4" size="large" />
                    <div class="flex-1">
                        <div class="text-sm text-gray-600 dark:text-gray-300">Sotilgan mahsulotlar</div>
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">
                            {{ productStats.totalSoldAmount ? formatCurrency(productStats.totalSoldAmount) : 'Loading...' }}
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="text-sm text-blue-600 mt-1">{{ productStats.totalKgSold ? productStats.totalKgSold : 'Loading...' }} Kg</div>
                            <div class="text-sm text-blue-600 mt-1">{{ productStats.totalSalesCount ? productStats.totalSalesCount : 'Loading...' }} ta sotuv</div>
                        </div>
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
                        <div class="text-sm text-gray-600 dark:text-gray-300">Sotilgan aralashmalar</div>
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">
                            {{ mixStats.totalSoldAmount ? formatCurrency(mixStats.totalSoldAmount) : 'Loading...' }}
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="text-sm text-blue-600 mt-1">{{ mixStats.totalKgSold ? mixStats.totalKgSold : 'Loading...' }} Kg</div>
                            <div class="text-sm text-blue-600 mt-1">{{ mixStats.totalSalesCount ? mixStats.totalSalesCount : 'Loading...' }} ta sotuv</div>
                        </div>
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
