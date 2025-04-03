<template>
    <Card style="border-radius: 6px">
        <template #title>
            <div class="flex justify-between items-center border-b-2 pb-2">
                <h5 style="margin: 0">{{ item?.name }}</h5>
                <!-- Har bir menu uchun alohida ref beriladi -->
                <Menu :ref="(el) => (menu[index] = el)" :model="overlayMenuItems" :popup="true" />
                <Button type="button" label="Options" icon="pi pi-angle-down" @click="toggleMenu($event, index, item)" style="width: auto" size="small" severity="secondary" />
            </div>
        </template>
        <hr width="100%" />
        <template #content>
            <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-5 border-b-2 pb-4">
                    <div class="flex justify-between">
                        <div class="">
                            <p class="text-[10px] uppercase text-gray-400">Miqdor</p>
                            <p class="font-medium" style="line-height: 0">{{ item?.size }} kg</p>
                        </div>
                        <div>
                            <p class="text-[10px] uppercase text-gray-400">Jami Summa</p>
                            <p class="font-medium text-base" style="line-height: 0">{{ formatCurrency(Number(item?.size) * Number(item?.price)) }}</p>
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <div>
                            <p class="text-[10px] uppercase text-gray-400">Sotib olish narxi</p>
                            <p class="font-medium" style="line-height: 0">{{ formatCurrency(item?.buyyingPrice) }}</p>
                        </div>
                        <div>
                            <p class="text-[10px] uppercase text-gray-400">1-kg sotilish narxi</p>
                            <p class="font-medium text-base" style="line-height: 0">{{ formatCurrency(item?.price) }}</p>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <Button type="button" label="Sotish" icon="pi pi-cart-minus" style="width: auto" />
                    <Button type="button" label="Qo'shish" icon="pi pi-cart-arrow-down" severity="secondary" style="width: auto" />
                </div>
            </div>
        </template>
    </Card>
    <!--Begin Delete Modal -->
    <Dialog header="O'chirish" v-model:visible="deletModal" :style="{ width: '350px' }" :modal="true">
        <div class="flex items-center justify-center">
            <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
            <span>O'chirishga ishonchingiz komilmi?</span>
        </div>
        <template #footer>
            <Button label="Yo'q" icon="pi pi-times" @click="closeDeletModal" text severity="secondary" />
            <Button :label="isLoading ? 'Loading...' : 'O\'chirish'" icon="pi pi-trash" @click="deletProductById()" severity="danger" outlined autofocus />
        </template>
    </Dialog>
    <!--End Delete Modal -->
    <!-- Begin Edit -->
    <Drawer v-model:visible="visibleEditProduct" header="Mahsulot Taxrirlash" position="right" class="!w-full md:!w-80 lg:!w-[30rem]">
        <EditProduct :product="product" @getProduct="emits"></EditProduct>
    </Drawer>
    <!-- End Edit -->
</template>

<script setup>
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, ref } from 'vue';
import { useRouter } from 'vue-router'; // Routerni import qilish
import formatCurrency from '../../utils/PriceFormatter';
import EditProduct from '../BarnComponents/BarnProduct/EditProduct.vue';

const router = useRouter();
const menu = ref([]); // Har bir menu uchun massiv sifatida ref saqlaymiz

const props = defineProps({ item: {} });
const emits = defineEmits(['getProduct']);
const product = ref({});
const deletModal = ref(false);
const toast = useToast();
const visibleEditProduct = ref(false);
const isLoading = ref(false);

// Har bir menu komponentini indeks orqali topamiz
const toggleMenu = (event, index, item) => {
    product.value = item;
    if (menu.value[index]) {
        menu.value[index].toggle(event);
    } else {
        console.error('Menu component is not properly initialized.');
    }
};
const deletProductModal = () => {
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
            router.push(`/barn/product/${product.value._id}`);
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
            deletProductModal();
        }
    },
    { separator: true },
    { label: 'Home', icon: 'pi pi-home' }
]);

const deletProductById = async () => {
    isLoading.value = true;
    try {
        const res = await axios.delete(`/api/product/${product.value._id}`);
        if (res.status == 200) {
            isLoading.value = false;
            toast.add({ severity: 'success', summary: "O'chirildi", detail: "Mahsulot o'chirildi", life: 3000 });
            deletModal.value = false;
            emits('getProduct');
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
