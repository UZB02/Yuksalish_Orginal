<template>
    <section class="grid grid-cols-1 gap-12">
        <div class="grid grid-cols-2 gap-3">
            <span class="grid grid-cols-1 md:grid-cols-2 md:flex md:flex-wrap md:gap-2">
                <label>Hajmi:</label>
                <h6>{{ mix.totalKg }} Kg</h6>
            </span>
            <span class="grid grid-cols-1 md:grid-cols-2 md:flex md:flex-wrap md:gap-2">
                <label>Tannarxi:</label>
                <h6>{{ formatCurrency(mix.basePrice * mix.totalKg)}}</h6>
            </span>
            <span class="grid grid-cols-1 md:grid-cols-2 md:flex md:flex-wrap md:gap-2">
                <label>Jami:</label>
                <h6>{{ formatCurrency(mixPrice * mix.totalKg)}}</h6>
            </span>
            <span class="grid grid-cols-1 md:grid-cols-2 md:flex md:flex-wrap md:gap-2">
                <label>Ko'zlangan foyda:</label>
                <h6>{{ formatCurrency(profit)}}</h6>
            </span>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <span class="grid  gap-2">
            <label for="price">Sotish narxi (UZS)</label>
            <InputNumber type="number" id="price" v-model="mixPrice" />
        </span>
          <Button @click="MakeMixById()" size="large" :label="isloading ? 'Loading...' : 'Tayyorlash'"></Button>
        </div>
    </section>
</template>
<script setup>
import axios from 'axios';
import { defineEmits, defineProps, ref, computed } from 'vue';
import formatCurrency from '@/utils/PriceFormatter';

const emits = defineEmits(['refreshGetMixFunction']);
const props = defineProps({
    mix: { type: Object }
});

const mix = ref(props.mix);
const isloading = ref(false);
const mixSize = ref(0);
const mixPrice = ref(mix.value.price);
const mixBuyyingPrice = ref(mix.value.basePrice);

const MakeMixById = async () => {
    isloading.value = true;
    try {
        const res = await axios.put(`/mix/makeMix/${mix.value._id}`, {
            size: mixSize.value,
            price: mixPrice.value,
            buyyingPrice: mixBuyyingPrice.value
        });
        if (res.status == 200) {
          isloading.value = false;
            emits('refreshGetMixFunction');
        }
    } catch (error) {
      isloading.value = false;
        console.log(error);
    }
};

const profit = computed(() => {
    return (mixPrice.value * mix.value.totalKg) - (mix.value.basePrice * mix.value.totalKg);
});
</script>
<style scoped>
h6 {
    margin: 0;
}
</style>
