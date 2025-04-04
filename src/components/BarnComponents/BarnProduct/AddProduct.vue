<template>
    <div class="grid grid-cols-1 gap-2">
        <span class="grid  gap-2">
            <label for="Name">Mahsulot nomi</label>
            <InputText type="text" id="Name" v-model="product.name" />
        </span>
        <span class="grid  gap-2">
            <label for="size">Miqdori (Kg)</label>
            <InputNumber type="number" id="size" v-model="product.size" />
        </span>
        <span class="grid  gap-2">
            <label for="price">Sotib olish narxi</label>
            <InputNumber type="number" id="price" v-model="product.price" />
        </span>
        <span class="grid  gap-2">
            <label for="buyyingPrice">Sotish narxi</label>
            <InputNumber type="number" id="buyyingPrice" v-model="product.buyyingPrice" />
        </span>
        <span class="grid grid-cols-2 gap-2">
            <span class="grid">
               <label>Tannarxi</label>
            <h6>{{ formatCurrency(product.size * product.price )}}</h6>
            </span>
            <span class="grid items-center justify-center">
               <label>Foyda</label>
            <h6>{{ formatCurrency(product.size * product.buyyingPrice - product.size * product.price) }}</h6>
            </span>
        </span>
        <Button @click="addProduct()" :label="isloading ? 'Loading...' : 'Qo\'shish'"></Button>
    </div>
</template>
<script setup>
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { defineEmits, ref, onMounted } from 'vue';
import formatCurrency from '@/utils/PriceFormatter';

const isloading = ref(false);
const toast = useToast();
const emits = defineEmits(['getProduct']);

const product = ref({
    name: '',
    price: null,
    currency: 'UZS',
    buyyingPrice: null,
    size: null
});


const addProduct = async () => {
    isloading.value = true;
    try {
        if (!product.value.name || !product.value.price || !product.value.buyyingPrice || !product.value.size) {
            toast.add({ severity: 'error', summary: 'Xatolik', detail: '⚠️ Iltimos, barcha maydonlarni to‘ldiring!', life: 3000 });
            isloading.value = false;
            return;
        }

        const res = await axios.post('/api/product', product.value);

        if (res.status === 201) {
            product.value = {
                name: '',
                price: null,
                currency: 'UZS',
                buyyingPrice: null,
                size: null
            };
            isloading.value = false;
            showSuccess();
            emits('getProduct');
            //   router.push("/ombor");
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
