<template>
    <section class="grid grid-cols-1 gap-6">
        <div class="flex justify-between">
            <span class="grid grid-cols-1 md:grid-cols-2 gap-1">
                <label>Mavjut:</label>
                <h6>{{ product.size }} Kg</h6>
            </span>
            <span class="grid grid-cols-1 md:grid-cols-2">
                <label>Tannarxi:</label>
                <h6>{{ formatCurrency(product.buyyingPrice) }}</h6>
            </span>
        </div>

        <div class="grid grid-cols-1 gap-4">
            <span class="grid gap-2">
                <label for="customer">Xaridor</label>
                <InputText id="customer" v-model="sellProduct.customer" placeholder="Xaridor Ismini Kiriting" />
            </span>
            <span class="grid gap-2">
                <label for="phone">Xaridor Raqami</label>
                <InputMask id="phone" v-model="sellProduct.phone" mask="+999(99) 999-99-99" placeholder="+998(91) 999-99-99" class="w-full" />
            </span>
            <span class="grid gap-2">
                <label for="productSize">Mahsulot Hajmi (Kg)</label>
                <InputNumber id="productSize" v-model="sellProduct.size" />
            </span>
            <span class="grid gap-2">
                <label for="price">Sotish narxi (UZS)</label>
                <InputNumber id="price" v-model="sellProduct.price" />
                <small v-if="sellProduct.price < sellProduct.buyyingPrice" class="text-red-500"> Sotish narxi tannarxidan kam ! </small>
            </span>
            <span class="grid gap-2">
                <label for="description">Tafsilot</label>
                <Textarea id="description" v-model="sellProduct.description" variant="filled" rows="5" cols="30" placeholder="Tafsilot kiriting" />
            </span>
            <Button @click="sellProductfunction" size="large" :label="isloading ? 'Loading...' : 'Sotish'" />
        </div>
    </section>
</template>

<script setup>
import formatCurrency from '@/utils/PriceFormatter';
import axios from 'axios';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, ref } from 'vue';
const toast = useToast();

const emits = defineEmits(['refreshGetProductFunction']);
const props = defineProps({
    product: { type: Object, required: true }
});

const product = props.product;
const isloading = ref(false);
console.log(product);

const sellProduct = ref({
    customer: '',
    productId: product._id,
    size: null,
    price: product.price,
    buyyingPrice: product.buyyingPrice,
    phone: '',
    currency: 'UZS',
    description: ''
});

const sellProductfunction = async () => {
    if (sellProduct.value.customer == '' || sellProduct.value.price == '') {
        toast.add({ severity: 'error', summary: 'Xatolik', detail: "Maydonlarni to'ldiring", life: 3000 });
        return;
    }
    isloading.value = true;
    try {
        const res = await axios.post(`/api/product-history`, {
            name: sellProduct.value.customer,
            productId: sellProduct.value.productId,
            size: sellProduct.value.size,
            sellingPrice: sellProduct.value.price,
            originalPrice: sellProduct.value.buyyingPrice,
            phone: sellProduct.value.phone,
            currency: sellProduct.value.currency,
            description: sellProduct.value.description,
            totalAmount: sellProduct.value.price * sellProduct.value.size,
            profit: sellProduct.value.price * sellProduct.value.size - sellProduct.value.buyyingPrice * sellProduct.value.size
        });
        if (res.status === 201) {
            toast.add({ severity: 'success', summary: 'Bajarildi', detail: 'Mahsulot Sotildi', life: 3000 });
            emits('refreshGetProductFunction');
        }
    } catch (error) {
        console.error('Xatolik:', error);
    } finally {
        isloading.value = false;
    }
};
</script>

<style scoped>
h6 {
    margin: 0;
}
</style>
