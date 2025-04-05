<template lang="">
  <h1>{{props.product.name}}</h1>
  <button @click="emit('closeAddModal')">Close</button>
</template>
<script setup>
import { defineEmits, defineProps, ref } from 'vue';
const emit = defineEmits(['closeAddModal']);

const props = defineProps({
    product: { type: Object },
    // isLoading: { type: Boolean },
    // sellProduct: { type: Object },
    // formatCurrency: { type: Function }
});
const product=ref(props.product)
console.log(product.value);
</script>
<style lang="">
    
</style>