<template>
    <div class="w-full grid grid-cols-2 shadow p-4 md:flex md:justify-between gap-5 flex-wrap mb-6 md:mt-2">
        <div>
            <p class="text-xs uppercase text-gray-400">Mahsulot nomi</p>
            <h6>
                {{ data.name ? data.name : 'Loading...' }}
            </h6>
        </div>
        <div>
            <p class="text-xs uppercase text-gray-400">Miqdor</p>
            <h6>{{ data.size ? data.size : 'Loading...' }} kg</h6>
        </div>
        <div>
            <p class="text-xs uppercase text-gray-400">1 kg narx</p>
            <h6>
                {{ data.buyyingPrice ? formatCurrency(Number(data?.buyyingPrice)) : 'Loading...' }}
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
                {{ data.size ? formatCurrency(Number(data?.size) * Number(data?.price)) : 'Loading...' }}
            </h6>
        </div>
        <div>
            <p class="text-xs uppercase text-gray-400">qo'shilgan vaqt</p>
            <h6>
                {{ data.created_at ? formatDateTime(data.created_at) : 'Loading...' }}
            </h6>
        </div>
    </div>
    <ProductIdTable :data="data" @getProduct="getProduct"/>
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
<style scoped>
h6{
    padding: 0;
    margin: 0;
}
</style>
