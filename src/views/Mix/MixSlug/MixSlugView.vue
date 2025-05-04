<template>
    <div class="w-full grid grid-cols-2 shadow p-4 md:flex md:justify-between gap-5 flex-wrap mb-6 md:mt-2">
        <div>
            <p class="text-xs uppercase text-gray-400">Mahsulot nomi</p>
            <h6>
                {{ data.title ? data.title : 'Loading...' }}
            </h6>
        </div>
        <div>
            <p class="text-xs uppercase text-gray-400">Miqdor</p>
            <h6>{{ data.totalKg ? data.totalKg : 'Loading...' }} kg</h6>
        </div>
        <div>
            <p class="text-xs uppercase text-gray-400">1 kg narx</p>
            <h6>
                {{ data.basePrice ? formatCurrency(Number(data?.basePrice)) : 'Loading...' }}
            </h6>
        </div>
        <div>
            <p class="text-xs uppercase text-gray-400">1 kg Sotish narxi</p>
            <h6>
                {{ data.price ? formatCurrency(Number(data?.price)) : 'Loading...' }}
            </h6>
        </div>
        <div>
            <p class="text-xs uppercase text-gray-400">Jami Summa</p>
            <h6>
                {{ data.totalKg ? formatCurrency(Number(data?.totalKg) * Number(data?.price)) : 'Loading...' }}
            </h6>
        </div>
        <div>
            <p class="text-xs uppercase text-gray-400">qo'shilgan vaqt</p>
            <h6>
                {{ data.createdAt ? formatDateTime(data.createdAt) : 'Loading...' }}
            </h6>
        </div>
    </div>
    <MixSlugTable :data="data" @getMixById="getMixById"/>
</template>
<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import MixSlugTable from '@/components/MixComponents/MixSlug/MixSlugTable.vue';
import formatDateTime from '@/utils/DateTimeFormatter';
import formatCurrency from '@/utils/PriceFormatter';
const id = useRoute().params.slug;
const data = ref([]);

const getMixById = async () => {
    try {
        const response = await axios.get(`/api/mix/${id}`);
        data.value = response.data;
        console.log(data.value);
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    getMixById();
});
</script>
<style scoped>
h6{
    padding: 0;
    margin: 0;
}
</style>
