<template>
    <section class="grid grid-cols-1 gap-12">
        <div class="flex justify-between">
            <span class="grid grid-cols-1 md:grid-cols-2 md:flex md:flex-wrap md:gap-2">
                <label>Hajmi:</label>
                <h6>{{ product.size }} Kg</h6>
            </span>
            <span class="grid grid-cols-1 md:grid-cols-2 md:flex md:flex-wrap md:gap-2">
                <label>Tannarxi:</label>
                <h6>{{ formatCurrency(product.costPrice * product.size)}}</h6>
            </span>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <span class="grid gap-2">
            <label for="size">Qo'shiladigan Kg</label>
            <InputNumber type="number" id="size" v-model="productSize" />
        </span>
          <span class="grid  gap-2">
            <label for="costPrice">Sotib olish narxi (UZS)</label>
            <InputNumber type="number" id="costPrice" v-model="costPrice" />
        </span>
          <span class="grid  gap-2">
            <label for="sellingPrice">Sotish narxi (UZS)</label>
            <InputNumber type="number" id="sellingPrice" v-model="productPrice" />
        </span>
          <Button @click="addProductById()" size="large" :label="isloading ? 'Loading...' : 'Qo\'shish'"></Button>
        </div>
    </section>
</template>
<script setup>
import axios from 'axios';
import { defineEmits, defineProps, ref } from 'vue';
import formatCurrency from '@/utils/PriceFormatter';
import { useToast } from 'primevue/usetoast';

const emits = defineEmits(['refreshGetProductFunction']);
const props = defineProps({
    product: { type: Object }
});

const toast = useToast();
const product = ref(props.product);
const isloading = ref(false);
const productSize = ref(0);
const productPrice = ref(product.value.sellingPrice);
const costPrice = ref(product.value.costPrice);

const addProductById = async () => {
    isloading.value = true;
    try {
        const res = await axios.put(`/api/product/size/${product.value._id}`, {
            size: productSize.value,
            sellingPrice: productPrice.value,
            costPrice: costPrice.value
        });
        if (res.status == 200) {
          isloading.value = false;
          emits('refreshGetProductFunction');
          toast.add({ severity: 'success', summary: 'Bajarildi', detail: 'Mahsulot Taxrirlandi', life: 3000 });
        }
    } catch (error) {
      isloading.value = false;
        console.log(error);
    }
};
</script>
<style scoped>
h6 {
    margin: 0;
}
</style>
