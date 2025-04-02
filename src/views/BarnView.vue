<template>
    <div class="flex justify-between items-center">
        <IconField iconPosition="left">
            <InputText v-model="searchQuery" type="text" placeholder="Qidiruv" />
            <InputIcon class="pi pi-search" />
        </IconField>
        <Button label="Maxsulot Qo'shish" icon="pi pi-plus"></Button>
    </div>
    
    <div class="relative rounded-sm mt-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        <BarnCard v-for="item in filteredData" :key="item.id" :item="item" @getProduct="getProduct" />
        <CardSkeleton v-if="isloading" />
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import BarnCard from '../components/BarnComponents/BarnCard.vue';
import CardSkeleton from '../components/BarnComponents/BarnCardSkeleton.vue';

const data = ref([]);
const searchQuery = ref(""); // Qidiruv maydoni uchun
const isloading = ref(true);

// API dan ma'lumotlarni olish
const getProduct = async () => {
    try {
        const res = await axios.get('/api/product');
        data.value = res.data;
        if (res.status == 200) {
            isloading.value = false;
        }
    } catch (error) {
        console.log(error);
    }
};

// Qidiruv natijalarini qaytarish
const filteredData = computed(() => {
    return data.value.filter(item => 
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) // Faqat name bo‘yicha qidirish
    );
});

onMounted(() => {
    getProduct();
});
</script>
