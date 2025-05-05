<template>
    <div class="h-auto w-full">
        <div class="flex items-center justify-between">
            <h4 class="font-semibold">Tahrirlash</h4>
            <span>
                <h6>Hajm: {{ totalSize }} Kg</h6>
            </span>
        </div>

        <div class="w-full h-auto mx-auto bg-white dark:bg-gray-900/50 p-4 rounded-2xl mt-2 flex flex-col gap-5">
            <form class="grid grid-cols-1 gap-5" @submit.prevent="addProductToComposition">
                <span class="grid gap-2">
                    <label for="mixTitle">Aralashma nomi</label>
                    <InputText id="mixTitle" size="large" v-model="newProduct.title" placeholder="Aralashma nomi" />
                </span>
                <span class="grid gap-2">
                    <label for="basePrice">Tayyorlash narxi</label>
                    <InputNumber id="basePrice" v-model="totalPrice" size="large" class="w-full" disabled />
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

                    <DataTable :value="newProduct?.composition || []" scrollable tableStyle="min-width: 800px;">
                        <Column header="ID">
                            <template #body="{ data }">
                                {{ newProduct.composition.indexOf(data) + 1 }}
                            </template>
                        </Column>
                        <Column field="name" header="Qo'shilgan mahsulotlar" />
                        <Column header="Hajmi">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <InputNumber v-model="data.kg" :inputStyle="{ width: '100px' }" :min="0" />
                                    <span>Kg</span>
                                </div>
                            </template>
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
                </div>
            </form>

            <div class="mt-10 flex justify-end gap-3">
                <Button @click="updateMix" size="large" :label="isloading ? 'Yuklanmoqda...' : 'Yangilash'"></Button>
                <Button @click="cancelEdit" size="large" label="Bekor qilish" severity="secondary"></Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import formatCurrency from '@/utils/PriceFormatter';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Select from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const router = useRouter();
const toast = useToast();
const mixId = router.currentRoute.value.params.id;

const mix = ref(null);
const products = ref([]);
const product = ref(null);
const changeAmount = ref(null);
const changedProduct = ref(null);
const mixTitle = ref('');
const isloading = ref(false);

const newProduct = ref({
    title: '',
    description: '',
    price: 0,
    composition: []
});

const getProducts = async () => {
    try {
        const res = await axios.get('/api/product');
        products.value = res.data;
    } catch (err) {
        console.error('Mahsulotlarni olishda xatolik:', err);
    }
};

const getMixById = async () => {
    try {
        const res = await axios.get(`/api/mix/${mixId}`);
        mix.value = res.data;

        newProduct.value = {
            title: res.data.title,
            description: res.data.description,
            price: res.data.price,
            composition: res.data.products.map((p) => ({
                id: p.product._id,
                name: p.product.name,
                kg: p.kg,
                buyyingPrice: p.product.buyyingPrice
            }))
        };
    } catch (err) {
        console.error('Mixni olishda xatolik:', err);
    }
};

watch(product, (selected) => {
    changedProduct.value = selected;
});

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
    }
};

const totalSize = computed(() => {
    return newProduct.value.composition.reduce((sum, item) => sum + Number(item.kg || 0), 0);
});

const totalPrice = computed(() => {
    return newProduct.value.composition.reduce((sum, item) => sum + item.buyyingPrice, 0);
});

const updateMix = async () => {
    isloading.value = true;

    const mappedProducts = newProduct.value.composition.map((item) => ({
        product: item.id,
        kg: item.kg
    }));

    try {
        const res = await axios.put(`/api/mix/${mixId}`, {
            title: newProduct.value.title,
            description: newProduct.value.description,
            price: newProduct.value.price,
            basePrice: totalPrice.value,
            totalKg: totalSize.value,
            stock: 20,
            sold: 10,
            products: mappedProducts
        });

        if (res.status === 200) {
            toast.add({ severity: 'success', summary: 'Yangilandi', detail: 'Mix muvaffaqiyatli yangilandi', life: 3000 });
            router.push('/mix');
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Xatolik', detail: error.response?.data?.message || 'Xatolik yuz berdi', life: 3000 });
    } finally {
        isloading.value = false;
    }
};

const cancelEdit = () => {
    router.push('/mix');
};

onMounted(() => {
    getProducts();
    getMixById();
});
</script>
