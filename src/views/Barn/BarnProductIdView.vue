<template>
    <div class="w-full grid grid-cols-2 md:flex md:justify-between gap-5 flex-wrap mb-6 md:mt-2">
        <div>
            <p class="text-xs uppercase text-gray-400">Mahsulot nomi</p>
            <p class="text-sm font-medium">
                {{ data.name ? data.name : 'Loading...' }}
            </p>
        </div>
        <div>
            <p class="text-xs uppercase text-gray-400">Miqdor</p>
            <p class="text-sm font-medium">{{ data.size ? data.size : 'Loading...' }} kg</p>
        </div>
        <div>
            <p class="text-xs uppercase text-gray-400">1 kg narx</p>
            <p class="text-sm font-medium">
                {{ data.price ? formatCurrency(Number(data?.price)) : 'Loading...' }}
            </p>
        </div>
        <div>
            <p class="text-xs uppercase text-gray-400">1 kg Sotish narxi</p>
            <p class="text-sm font-medium">
                {{ data.buyyingPrice ? formatCurrency(Number(data?.buyyingPrice)) : 'Loading...' }}
            </p>
        </div>
        <div>
            <p class="text-xs uppercase text-gray-400">Jami Summa</p>
            <p class="text-sm font-medium">
                {{ data.size ? formatCurrency(Number(data?.size) * Number(data?.price)) : 'Loading...' }}
            </p>
        </div>
        <div>
            <p class="text-xs uppercase text-gray-400">qo'shilgan vaqt</p>
            <p class="text-sm font-medium">
                {{ data.created_at ? formatDateTime(data.created_at) : 'Loading...' }}
            </p>
        </div>
    </div>
    <ProductIdTable />
</template>
<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ProductIdTable from '../../components/BarnComponents/BarnProductIdTable.vue';
import formatDateTime from '../../utils/DateTimeFormatter';
import formatCurrency from '../../utils/PriceFormatter';
const id = useRoute().params.id;
const data = ref([]);

const getProduct = async () => {
    try {
        const response = await axios.get(`/api/product/${id}`);
        data.value = response.data;
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    getProduct();
});
</script>
