<template>
    <div class="grid grid-cols-1 gap-4">
        <span class="grid  gap-2">
            <label for="Name">Mahsulot nomi</label>
            <InputText type="text" id="Name" v-model="product.name" />
        </span>
        <span class="grid  gap-2">
            <label for="size">Miqdori (Kg)</label>
            <InputNumber type="number" id="size" v-model="product.size" />
        </span>
        <span class="grid  gap-2">
            <label for="costPrice">Sotib olish narxi (UZS)</label>
            <InputNumber type="number" id="costPrice" v-model="product.costPrice" />
        </span>
        <span class="grid  gap-2">
            <label for="sellingPrice">Sotish narxi (UZS)</label>
            <InputNumber type="number" id="sellingPrice" v-model="product.sellingPrice" />
        </span>
        <Button @click="addProduct()" size="large" :label="isloading ? 'Loading...' : 'Qo\'shish'"></Button>
    </div>
</template>
<script setup>
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { defineEmits, ref, onMounted } from 'vue';

const isloading = ref(false);
const toast = useToast();
const emits = defineEmits(['getProduct']);

const product = ref({
    name: '',
    sellingPrice: null,
    currency: 'UZS',
    costPrice: null,
    size: null
});


const addProduct = async () => {
    isloading.value = true;
    try {
        if (!product.value.name || !product.value.sellingPrice || !product.value.costPrice || !product.value.size) {
            toast.add({ severity: 'error', summary: 'Xatolik', detail: '⚠️ Iltimos, barcha maydonlarni to‘ldiring!', life: 3000 });
            isloading.value = false;
            return;
        }

        const res = await axios.post('/api/product', product.value);

        if (res.status === 201) {
            product.value = {
                name: '',
                sellingPrice: null,
                currency: 'UZS',
                costPrice: null,
                size: null
            };
            isloading.value = false;
            showSuccess();
            emits('getProduct');
        }
    } catch (error) {
        isloading.value = false;
        toast.add({ severity: 'error', summary: 'Xatolik', detail: '���️ Xatolik yuz berdi!', life: 3000 });
        console.log(error);
    }
};

function showSuccess() {
    toast.add({ severity: 'success', summary: 'Bajarildi', detail: "Mahsulot qo'shildi", life: 3000 });
}

onMounted(() => {
  product.value
});
</script>
<style scoped></style>
