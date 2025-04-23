<template>
    <Card style="border-radius: 6px" class="border-t-[10px] border-slate-300 dark:border-slate-600">
        <template #title>
            <div class="flex justify-between items-center border-b-2 dark:border-gray-600 pb-2">
                <h5 style="margin: 0">{{ item?.title }}</h5>
                <!-- Har bir menu uchun alohida ref beriladi -->
                <Menu :ref="(el) => (menu[index] = el)" :model="overlayMenuItems" :popup="true" />
                <Button type="button" label="Sozlamalar" icon="pi pi-angle-down" @click="toggleMenu($event, index, item)" style="width: auto" size="small" severity="secondary" />
            </div>
        </template>
        <template #content>
            <div class="flex flex-col gap-2">
                <div class="grid grid-cols-2 gap-y-4 gap-2">
                    <div class="flex items-center gap-2">
                        <span class="text-gray-400 text-sm">Tayyorlanish:</span>
                        <span class="text-lg font-medium">
                            {{ item?.quantity }}
                        </span>
                    </div>
                    <div class="flex items-center justify-end gap-2">
                        <span class="text-gray-400 text-sm">Qolgan KG:</span>
                        <span class="text-lg font-medium">
                            {{ item?.totalKg }} Kg
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-gray-400 text-sm">Narx:</span>
                        <span class="text-lg font-medium">
                            {{ formatCurrency(item?.price) }}
                        </span>
                    </div>
                    <div class="flex items-center justify-end gap-2">
                        <span class="text-gray-400 text-sm">Xolat:</span>
                        <Badge :severity="item?.status == 'finished' ? 'secondary' : ''">{{ item?.status }}</Badge>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="grid grid-cols-2 gap-2 border-t-2 dark:border-gray-600 pt-2">
                <Button @click="addProductByIdModalOpen(item)" type="button" label="Tayyorlash" icon="pi pi-cart-arrow-down" severity="secondary" style="width: auto" />
                <Button @click="SellProductModalOpen(item)" type="button" label="Sotish" icon="pi pi-cart-minus" style="width: auto" />
            </div>
        </template>
    </Card>
    <!--Begin Delete Modal -->
    <Dialog header="O'chirish" v-model:visible="deletModal" :style="{ width: '350px' }" :modal="true">
        <div class="flex items-center justify-center">
            <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
            <span>{{ mix.title }} ni o'chirishga ishonchingiz komilmi?</span>
        </div>
        <template #footer>
            <Button label="Yo'q" icon="pi pi-times" @click="closeDeletModal" text severity="secondary" />
            <Button :label="isLoading ? 'Loading...' : 'O\'chirish'" icon="pi pi-trash" @click="deletMixById()" severity="danger" outlined autofocus />
        </template>
    </Dialog>
    <!--End Delete Modal -->
    <!-- Begin Edit -->
    <Drawer v-model:visible="visibleEditProduct" header="Mahsulot Taxrirlash" position="right" class="!w-full md:!w-80 lg:!w-[30rem]">
        <div class="grid grid-cols-1 gap-4">
            <span class="grid grid-cols-1 gap-2">
                <label for="Name">Mahsulot nomi</label>
                <InputText type="text" id="Name" v-model="editproduct.name" />
            </span>
            <span class="grid grid-cols-1 gap-2">
                <label for="size">Miqdori (Kg)</label>
                <InputNumber type="number" id="size" v-model="editproduct.size" />
            </span>
            <span class="grid grid-cols-1 gap-2">
                <label for="price">Sotib olish narxi</label>
                <InputNumber type="number" id="price" v-model="editproduct.price" />
            </span>
            <span class="grid grid-cols-1 gap-2">
                <label for="buyyingPrice">Sotish narxi</label>
                <InputNumber type="number" id="buyyingPrice" v-model="editproduct.buyyingPrice" />
            </span>
            <Button @click="editProductById()" size="large" :label="isLoading ? 'Yuklanmoqda...' : 'Taxrirlash'"></Button>
        </div>
    </Drawer>
    <!-- End Edit -->
    <!-- Begin AddProductById Modal -->
    <Drawer v-model:visible="visibleAddProductById" :header="mix.name + ` ` + `ga qo'shish`" position="right" class="!w-full md:!w-96 lg:!w-[30rem]">
        <AddProductById :mix="mix" @refreshGetMixFunction="refreshGetMixFunction"></AddProductById>
    </Drawer>
    <!-- End AddProductById Modal -->
    <!-- Begin SellProduct Modal -->
    <Drawer v-model:visible="visibleSellProduct" :header="mix.name + ` ` + `dan sotish`" position="right" class="!w-full md:!w-96 lg:!w-[30rem]">
        <SellProduct :mix="mix" @refreshGetMixFunction="refreshGetMixFunction"></SellProduct>
    </Drawer>
    <!-- End SellProduct Modal -->
</template>

<script setup>
import formatCurrency from '@/utils/PriceFormatter';
import axios from 'axios';
import Badge from 'primevue/badge';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, ref } from 'vue';
import { useRouter } from 'vue-router'; // Routerni import qilish
import AddProductById from './AddMixById.vue';
import SellProduct from './SellMix.vue';

const router = useRouter();
const menu = ref([]); // Har bir menu uchun massiv sifatida ref saqlaymiz

const props = defineProps({ item: {} });
const emits = defineEmits(['getMix']);
const mix = ref({});
const deletModal = ref(false);
const toast = useToast();
const visibleEditProduct = ref(false);
const visibleAddProductById = ref(false);
const visibleSellProduct = ref(false);
const isLoading = ref(false);
const editproduct = ref({
    id: null,
    name: '',
    price: '',
    currency: 'UZS',
    buyyingPrice: '',
    size: ''
});

// Har bir menu komponentini indeks orqali topamiz
const toggleMenu = (event, index, item) => {
    mix.value = item;
    editproduct.value = {
        id: item._id,
        name: item.name,
        price: item.price,
        buyyingPrice: item.buyyingPrice,
        size: item.size
    };
    if (menu.value[index]) {
        menu.value[index].toggle(event);
    } else {
        console.error('Menu component is not properly initialized.');
    }
};
const deletMixModal = () => {
    deletModal.value = true;
};

function closeDeletModal() {
    deletModal.value = false;
}
const overlayMenuItems = ref([
    {
        label: 'Batafsil',
        icon: 'pi pi-eye',
        command: () => {
            router.push(`/barn/product/${mix.value._id}`);
        }
    },
    {
        label: 'Taxrirlash',
        icon: 'pi pi-refresh',
        command: () => {
            visibleEditProduct.value = true;
        }
    },
    {
        label: "O'chirish",
        icon: 'pi pi-trash',
        command: () => {
            deletMixModal();
        }
    }
    // { separator: true },
    // { label: 'Home', icon: 'pi pi-home' }
]);

const deletMixById = async () => {
    isLoading.value = true;
    try {
        const res = await axios.delete(`/api/mix/${mix.value._id}`);
        if (res.status == 200) {
            isLoading.value = false;
            toast.add({ severity: 'success', summary: "O'chirildi", detail: "Mahsulot o'chirildi", life: 3000 });
            deletModal.value = false;
            emits('getMix');
        }
    } catch (error) {
        console.log(error);
    }
};

const editProductById = async () => {
    isLoading.value = true;
    try {
        const res = await axios.put(`/api/product/${editproduct.value.id}`, {
            _id: editproduct.value.id,
            name: editproduct.value.name,
            size: editproduct.value.size,
            price: editproduct.value.price,
            buyyingPrice: editproduct.value.buyyingPrice
        });
        if (res.status == 200) {
            isLoading.value = false;
            visibleEditProduct.value = false;
            emits('getMix');
            toast.add({ severity: 'success', summary: 'Bajarildi', detail: 'Mahsulot Taxrirlandi', life: 3000 });
        }
    } catch (error) {
        isLoading.value = false;
        console.log(error);
    }
};

const addProductByIdModalOpen = (item) => {
    visibleAddProductById.value = true;
    product.value = item;
};
const SellProductModalOpen = (item) => {
    visibleSellProduct.value = true;
    product.value = item;
};

const refreshGetMixFunction = () => {
    emits('getMix');
    visibleAddProductById.value = false;
    visibleSellProduct.value = false;
};
</script>
