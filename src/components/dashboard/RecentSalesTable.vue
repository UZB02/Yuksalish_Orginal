
<template>
    <div class="card ">
      <h1 class="text-xl">Aralashma sotuvi</h1>
        <DataTable :value="products" tableStyle="min-width: 50rem">
            <Column field="code" header="Sana"></Column>
            <Column field="name" header="Haridor"></Column>
            <Column field="category" header="Aralashma"></Column>
            <Column field="quantity" header="Kg"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const products = ref([
 {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
},{
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
},
]);

</script>
<style scoped>
.card{
  padding: 15px;
  margin: 0;
}
</style>