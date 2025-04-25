<template>
    <section class="grid grid-cols-1 gap-12">
        <div class="flex justify-between">
            <span class="grid grid-cols-1 md:grid-cols-2 md:flex md:flex-wrap md:gap-2">
                <label>Hajmi:</label>
                <h6>{{ mix.totalKg }} Kg</h6>
            </span>
            <span class="grid grid-cols-1 md:grid-cols-2 md:flex md:flex-wrap md:gap-2">
                <label>Tannarxi:</label>
                <h6>{{ formatCurrency(mix.basePrice * mix.totalKg)}}</h6>
            </span>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <span class="grid gap-2">
            <label for="size">Qo'shiladigan Kg</label>
            <InputNumber type="number" id="size" v-model="mixSize" />
        </span>
          <span class="grid  gap-2">
            <label for="buyyingprice">Sotib olish narxi (UZS)</label>
            <InputNumber type="number" id="buyyingprice" v-model="mixBuyyingPrice" />
        </span>
          <span class="grid  gap-2">
            <label for="price">Sotish narxi (UZS)</label>
            <InputNumber type="number" id="price" v-model="mixPrice" />
        </span>
          <Button @click="addMixById()" size="large" :label="isloading ? 'Loading...' : 'Qo\'shish'"></Button>
        </div>
    </section>
</template>
<script setup>
import axios from 'axios';
import { defineEmits, defineProps, ref } from 'vue';
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

const addMixById = async () => {
    isloading.value = true;
    try {
        const res = await axios.put(`/api/product/size/${mix.value._id}`, {
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
</script>
<style scoped>
h6 {
    margin: 0;
}
</style>
