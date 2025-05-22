<template>
    <section class="grid grid-cols-1 gap-6">
        <div class="grid grid-cols-2 gap-3">
            <span class="grid grid-cols-1 md:grid-cols-2 md:flex md:flex-wrap md:gap-2">
                <label>Mahsulot miqdori:</label>
                <h6>{{ totalSize }} Kg</h6>
            </span>
            <span class="grid grid-cols-1 md:grid-cols-2 md:flex md:flex-wrap md:gap-2">
                <label>Tayyorlanish narxi:</label>
                <h6>{{ formatCurrency(minPrice) }}</h6>
            </span>
        </div>
        <div class="grid grid-cols-1 gap-4">
            <span class="grid gap-2">
                <label for="price">Sotish narxi (UZS)</label>
                <InputNumber v-model="mixPrice" inputId="price" suffix=" UZS" size="large"  />
            </span>
            <Button @click="MakeMixById" size="large" :label="isloading ? 'Loading...' : 'Tayyorlash'" :disabled="isloading" />
        </div>
    </section>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import formatCurrency from '@/utils/PriceFormatter';

const emits = defineEmits(['refreshGetMixFunction']);
const props = defineProps({
    mix: { type: Object, required: true }
});

const mix = props.mix;
const isloading = ref(false);
const mixPrice = ref(mix.sellingPrice || 0);
console.log(mixPrice.value);

const MakeMixById = async () => {
    isloading.value = true;
    try {
        const res = await axios.post('/api/mix/makeMix', {
            mixId: mix._id,
            price: mixPrice.value
        });
        if (res.status === 200) {
            emits('refreshGetMixFunction');
        }
    } catch (error) {
        console.error(error);
    } finally {
        isloading.value = false;
    }
};


const totalSize = computed(() => {
    return mix.products.reduce((sum, item) => sum + Number(item.kg || 0), 0);
});

const minPrice = computed(() => {
    const total = mix.products.reduce((sum, item) => {
        return sum + Number(item.product.costPrice || 0) * Number(item.kg || 0);
    }, 0);
    return totalSize.value > 0 ? total / totalSize.value : 0;
});
</script>

<style scoped>
h6 {
    margin: 0;
}
</style>
