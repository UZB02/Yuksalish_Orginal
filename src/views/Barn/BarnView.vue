<template>
    <div class="grid grid-cols-12 gap-2">
        <div class="col-span-10 sm:col-span-8 md:col-span-9 xl:col-span-10">
            <IconField class="sm:w-80 md:w-96">
                <InputText v-model="searchQuery" type="text" placeholder="Qidiruv" class="w-full" />
                <InputIcon class="pi pi-search" />
            </IconField>
        </div>
        <Button @click="visibleAddProduct = true" class="col-span-2 sm:col-span-4 md:col-span-3 xl:col-span-2 flex items-center gap-2">
            <i class="pi pi-plus"></i>
            <span class="hidden sm:inline">Maxsulot Qo'shish</span>
        </Button>
    </div>

    <div class="relative rounded-sm mt-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        <BarnCard v-for="item in filteredData" :key="item.id" :item="item" @getProduct="getProduct" />
        <CardSkeleton v-if="isloading" />
    </div>
    <Drawer v-model:visible="visibleAddProduct" header="Mahsulot Qo'shish" position="right" class="!w-full md:!w-80 lg:!w-[30rem]">
        <AddProductForm @getProduct="getProduct"></AddProductForm>
    </Drawer>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import BarnCard from '../../components/BarnComponents/BarnCard.vue';
import CardSkeleton from '../../components/BarnComponents/BarnCardSkeleton.vue';
import AddProductForm from '../../components/BarnComponents/BarnProduct/AddProduct.vue';

const data = ref([]);
const searchQuery = ref(''); // Qidiruv maydoni uchun
const isloading = ref(true);
const visibleAddProduct = ref(false);

// API dan ma'lumotlarni olish
const getProduct = async () => {
    try {
        const res = await axios.get('/api/product');
        data.value = res.data;
        if (res.status == 200) {
            isloading.value = false;
            visibleAddProduct.value = false;
        }
        console.log(data.value);
    } catch (error) {
        console.log(error);
    }
};

// Qidiruv natijalarini qaytarish
const filteredData = computed(() => {
    return data.value.filter(
        (item) => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) // Faqat name bo‘yicha qidirish
    );
});

onMounted(() => {
    getProduct();
});
</script>
