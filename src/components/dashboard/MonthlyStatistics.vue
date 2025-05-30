<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    chartData: Object
});

const emit = defineEmits(['update:month', 'update:year']);

const months = ref([
    { name: 'Yanvar', value: 1 }
    // ... qolgan oylar
]);

const years = ref([2022, 2023, 2024, 2025]);

const month = ref(new Date().getMonth() + 1);
const year = ref(new Date().getFullYear());

const chartOptions = ref({
    // Chart konfiguratsiyasi
});

watch(month, (newVal) => {
    emit('update:month', newVal);
});

watch(year, (newVal) => {
    emit('update:year', newVal);
});
</script>

<template>
    <Card>
        <template #title>
            <div class="flex align-items-center justify-content-between">
                <span>Oylik statistika</span>
                <div class="flex gap-2">
                    <Dropdown v-model="month" :options="months" optionLabel="name" optionValue="value" placeholder="Oy" style="width: 120px" />
                    <Dropdown v-model="year" :options="years" placeholder="Yil" style="width: 100px" />
                </div>
            </div>
        </template>
        <template #content>
            <Chart type="line" :data="chartData" :options="chartOptions" :height="300" />
        </template>
    </Card>
</template>
