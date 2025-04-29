<template>
    <div class="h-auto w-full">
        <div class="flex items-center justify-between">
            <h4 class="font-semibold">Mahsulot Tarkibi</h4>
            <span>
                <h6>Hajm: {{ totalSize }} Kg</h6>
            </span>
        </div>

        <div class="w-full h-auto mx-auto bg-white dark:bg-gray-900/50 p-4 rounded-2xl mt-2 flex flex-col gap-5">
            <form class="grid grid-cols-1 gap-5" @submit.prevent="addProductToComposition">
                <span class="grid gap-2">
                    <label for="productTitle">Yangi aralashma nomi</label>
                    <InputText id="productTitle" size="large" v-model="productTitle" placeholder="Aralashma nomi" />
                </span>
                <span class="grid gap-2">
                    <label for="price">Tayyorlash narxi</label>
                    <InputNumber id="price" v-model="totalPrice" size="large" class="w-full" />
                </span>
                <span class="grid gap-2">
                    <label for="price">Sotish narxi</label>
                    <InputNumber id="price" v-model="newProduct.price" size="large" class="w-full" />
                </span>
                <span class="grid gap-2">
                    <label for="description">Tafsilot</label>
                    <Textarea id="description" v-model="newProduct.description" variant="filled" rows="5" cols="30" placeholder="Tafsilot kiriting" />
                </span>
                <div class="grid grid-cols-1 gap-5 bg-gray-200 p-4 rounded">
                    <span class="grid gap-2">
                        <label for="select">Mahsulot tanlang</label>
                        <Select v-model="product" :options="products" optionLabel="name" placeholder="Mahsulot tanlang" class="w-full" size="large" />
                    </span>

                    <span class="grid gap-2">
                        <label for="amount">Hajmi (kg)</label>
                        <InputNumber id="amount" v-model="changeAmount" placeholder="0kg" size="large" class="w-full" />
                        <div v-if="changedProduct?.size < changeAmount" class="text-red-600 text-xs">Mavjud: {{ changedProduct?.size }} kg</div>
                    </span>
                    <Button @click="addProductToComposition()" size="large" label="Qo'shish"></Button>
                    <!-- Jadval -->
                    <DataTable :value="newProduct?.composition || []" scrollable tableStyle="min-width: 800px;">
                        <Column header="ID">
                            <template #body="{ data }">
                                {{ newProduct.composition.indexOf(data) + 1 }}
                            </template>
                        </Column>
                        <Column field="name" header="Qo'shilgan mahsulotlar" />
                        <Column header="Hajmi">
                            <template #body="{ data }"> {{ data.kg }} Kg </template>
                        </Column>
                        <Column header="Narx">
                            <template #body="{ data }"> {{ formatCurrency(data.buyyingPrice * data.kg) }} </template>
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
                </div>
            </form>
            <div class="mt-10 flex justify-end gap-3">
                <Button @click="createNewMix()" size="large" :label="isloading ? 'Loading...' : 'Saqlash'"></Button>
                <Button @click="clearProducts()" size="large" label="Bekor qilish" severity="secondary"></Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import formatCurrency from '../../utils/Price'

const router = useRouter();
const toast = useToast();

const products = ref([]);
const product = ref(null);
const productTitle = ref('');
const changeAmount = ref(null);
const changedProduct = ref(null);
const newProduct = ref({ title: '', composition: [] });
const isloading = ref(false);
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

watch(
    [productTitle, newProduct],
    () => {
        saveProducts();
    },
    { deep: true }
);

const addProductToComposition = () => {
    if (!changedProduct.value || !changeAmount.value) return;

    if (changeAmount.value > changedProduct.value.size) {
        return;
    }

    const newItem = {
        id: changedProduct.value._id,
        kg: changeAmount.value,
        name: changedProduct.value.name,
        buyyingPrice: changedProduct.value.buyyingPrice
    };

    const alreadyExists = newProduct.value.composition.some((p) => p.id === newItem.id);
    if (!alreadyExists) {
        newProduct.value.composition.push(newItem);
    }

    changeAmount.value = null;
    product.value = null;
};

const deleteProduct = (productItem) => {
    const index = newProduct.value.composition.findIndex((p) => p.id === productItem.id);
    if (index !== -1) {
        newProduct.value.composition.splice(index, 1);
        saveProducts();
    }
};

const clearProducts = () => {
    newProduct.value = { title: '', composition: [] };
    productTitle.value = '';
    localStorage.removeItem('newProduct');
    router.push('/mix');
};

const saveProducts = () => {
    newProduct.value.title = productTitle.value;
    localStorage.setItem('newProduct', JSON.stringify(newProduct.value));
};

const loadSavedProduct = () => {
    const savedData = JSON.parse(localStorage.getItem('newProduct'));
    if (savedData) {
        productTitle.value = savedData.title || '';
        newProduct.value = {
            title: savedData.title || '',
            totalKg: totalSize,
            price: savedData.price,
            basePrice: totalPrice,
            description: savedData.description,
            composition: savedData.composition || []
        };
    }
};

const totalSize = computed(() => {
    return newProduct.value.composition.reduce((sum, item) => {
        return sum + Number(item.kg || 0);
    }, 0);
});
const totalPrice = computed(() => {
    return newProduct.value.composition.reduce((sum, item) => {
        return sum + Number(item.buyyingPrice || 0);
    }, 0);
});

const createNewMix = async () => {
    console.log('Yangi mahsulot:', newProduct.value);
    isloading.value = true;
    // Har bir mahsulotni kerakli formatga o'tkazamiz
    const mappedProducts = newProduct.value.composition.map((item) => ({
        product: item.id,
        kg: item.kg
    }));
    try {
        const res = await axios.post(`/api/mix`, {
            title: newProduct.value.title,
            description: newProduct.value.description,
            price: newProduct.value.price,
            basePrice: totalPrice.value,
            totalKg: totalSize.value,
            stock: 20,
            quantity: 10,
            products: mappedProducts
        });
        console.log(res);
        if (res.status === 201) {
            isloading.value = false;
            toast.add({ severity: 'success', summary: 'Bajarildi', detail: "Muvofaqqiyatli qo'shildi", life: 3000 });
            clearProducts();
        }
    } catch (error) {
        console.error('Xatolik:', error);
        isloading.value = false;
        toast.add({ severity: 'error', summary: 'Xatolik', detail: error.response.data.message, life: 3000 });
    }
};
</script>
