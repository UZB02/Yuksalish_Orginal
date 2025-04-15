<template>
  <div class="h-screen w-full">
    <div class="flex items-center justify-between">
      <h4 class=" font-semibold">Mahsulot Tarkibi</h4>
      <span>
        <h6>Hajm: {{totalSize}} Kg</h6>
      </span>
    </div>

    <div class="w-full h-screen mx-auto bg-white dark:bg-gray-900/50 p-4 rounded-2xl mt-2 flex flex-col gap-5">
      <form class="grid grid-cols-1 gap-5" @submit.prevent="addProductToComposition">
        <span class="grid gap-2">
          <label for="productName">Yangi mahsulot nomi</label>
          <InputText id="productName" size="large" v-model="productName" placeholder="Mahsulot nomi" />
        </span>

        <span class="grid gap-2">
          <label for="dropdown">Mahsulot tanlang</label>
          <Dropdown
            v-model="product"
            :options="products"
            optionLabel="name"
            placeholder="Mahsulot tanlang"
            class="w-full"
            size="large"
          />
        </span>

        <span class="grid gap-2">
          <label for="amount">Hajmi (kg)</label>
          <InputNumber id="amount" v-model="changeAmount" placeholder="0kg" size="large" class="w-full" />
          <div v-if="changedProduct?.size < changeAmount" class="text-red-600 text-xs">
            Mavjud: {{ changedProduct?.size }} kg
          </div>
        </span>

        <Button @click="addProductToComposition()" size="large" label="Qo'shish"></Button>
      </form>

      <!-- Jadval -->
      <DataTable :value="newProduct?.composition || []" scrollable tableStyle="min-width: 1100px">
        <Column header="ID">
          <template #body="{ data }">
            {{ newProduct.composition.indexOf(data) + 1 }}
          </template>
        </Column>
        <Column field="name" header="Qo'shilgan mahsulotlar" />
        <Column header="Hajmi">
          <template #body="{ data }"> {{ data.size }} Kg </template>
        </Column>
        <Column header="Narx">
          <template #body="{ data }"> {{ formatCurrency(data.price) }} </template>
        </Column>
        <Column header="Amallar">
          <template #body="{ data }">
            <button v-tooltip.top="'O\'chirish'" @click="deleteProduct(data)">
              <i class="pi pi-trash text-red-500 mr-2"></i>
            </button>
          </template>
        </Column>
      </DataTable>
      <!-- Tugmalar -->
      <div class="mt-10 flex justify-end gap-3">
        <Button @click="createNewProduct()" size="large" label="Saqlash"></Button>
        <Button @click="clearProducts()" size="large" label="Bekor qilish" severity="secondary"></Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';

import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import formatCurrency from '../../utils/PriceFormatter';

const router = useRouter();

const products = ref([]);
const product = ref(null);
const productName = ref('');
const changeAmount = ref(null);
const changedProduct = ref(null);
const newProduct = ref({ name: '', composition: [] });

onMounted(() => {
  loadSavedProduct();
  getProducts();
});

const getProducts = async () => {
  try {
    const res = await axios.get('/api/product');
    products.value = res.data;
  } catch (err) {
    console.error('Mahsulotlarni olishda xatolik:', err);
  }
};

watch(product, (selected) => {
  changedProduct.value = selected;
});

watch([productName, newProduct], () => {
  saveProducts();
}, { deep: true });

const addProductToComposition = () => {
  if (!changedProduct.value || !changeAmount.value) return;

  if (changeAmount.value > changedProduct.value.size) {
    return;
  }

  const newItem = {
    id: changedProduct.value._id,
    name: changedProduct.value.name,
    price: changedProduct.value.buyyingPrice * changeAmount.value,
    size: changeAmount.value
  };

  const alreadyExists = newProduct.value.composition.some((p) => p.id === newItem.id);
  if (!alreadyExists) {
    newProduct.value.composition.push(newItem);
  }

  changeAmount.value = null;
};

const deleteProduct = (productItem) => {
  const index = newProduct.value.composition.findIndex((p) => p.id === productItem.id);
  if (index !== -1) {
    newProduct.value.composition.splice(index, 1);
    saveProducts();
  }
};

const clearProducts = () => {
  newProduct.value = { name: '', composition: [] };
  productName.value = '';
  localStorage.removeItem('newProduct');
  router.push('/mix');
};

const saveProducts = () => {
  newProduct.value.name = productName.value;
  localStorage.setItem('newProduct', JSON.stringify(newProduct.value));
};

const loadSavedProduct = () => {
  const savedData = JSON.parse(localStorage.getItem('newProduct'));
  if (savedData) {
    productName.value = savedData.name || '';
    newProduct.value = {
      name: savedData.name || '',
      composition: savedData.composition || []
    };
  }
};

const totalSize = computed(() => {
  return newProduct.value.composition.reduce((sum, item) => {
    return sum + Number(item.size || 0);
  }, 0);
});

const createNewProduct = () => {
  console.log('Yangi mahsulot:', newProduct.value);
};
</script>
