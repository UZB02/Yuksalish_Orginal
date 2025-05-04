<template>
    <div class="grid grid-cols-12 gap-2">
        <div class="col-span-10 sm:col-span-8 md:col-span-9 xl:col-span-10">
            <IconField class="sm:w-80 md:w-96">
                <InputText v-model="searchQuery" type="text" placeholder="Qidiruv" class="w-full" />
                <InputIcon class="pi pi-search" />
            </IconField>
        </div>
        <Button @click="router.push(`/mix/add`)" class="col-span-2 sm:col-span-4 md:col-span-3 xl:col-span-2 flex items-center gap-2">
            <i class="pi pi-plus"></i>
            <span class="hidden sm:inline">Formula tayyorlash</span>
        </Button>
    </div>

    <div class="relative rounded-sm mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
        <MixCard v-for="item in filteredData" :key="item.id" :item="item" @getMix="getMix" />
        <CardSkeleton v-if="isloading" />
    </div>
    <Drawer v-model:visible="visibleAddMix" header="Mahsulot Qo'shish" position="right" class="!w-full md:!w-80 lg:!w-[30rem]">
        <AddProductForm @getMix="getMix"></AddProductForm>
    </Drawer>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'; // Routerni import qilish
import CardSkeleton from '../../components/BarnComponents/BarnCardSkeleton.vue';
import AddProductForm from '../../components/BarnComponents/BarnProduct/AddProduct.vue';
import MixCard from '../../components/MixComponents/MixCard.vue';

const router = useRouter();
const data = ref([]);
const searchQuery = ref(''); // Qidiruv maydoni uchun
const isloading = ref(true);
const visibleAddMix = ref(false);

// API dan ma'lumotlarni olish
const getMix = async () => {
    try {
        const res = await axios.get('/api/mix');
        data.value = res.data;
        console.log(data.value);
        if (res.status == 200) {
            isloading.value = false;
            visibleAddMix.value = false;
        }
    } catch (error) {
        console.log(error);
    }
};

// Qidiruv natijalarini qaytarish
const filteredData = computed(() => {
    return data?.value.filter(
        (item) => item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) // Faqat name bo‘yicha qidirish
    );
});

onMounted(() => {
    getMix();
});
</script>
