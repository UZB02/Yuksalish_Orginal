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
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue';
import { useRouter } from 'vue-router'; // Routerni import qilish
import formatCurrency from '../../utils/PriceFormatter';

const router = useRouter();
const menu = ref([]); // Har bir menu uchun massiv sifatida ref saqlaymiz

const props = defineProps({ item: {} });
const emits = defineEmits(['getProduct']);
const productId = ref(null);

// Har bir menu komponentini indeks orqali topamiz
const toggleMenu = (event, index, item) => {
    productId.value = item._id;
    if (menu.value[index]) {
        menu.value[index].toggle(event);
    } else {
        console.error('Menu component is not properly initialized.');
    }
};

const overlayMenuItems = ref([
    {
        label: 'Batafsil',
        icon: 'pi pi-eye',
        command: () => {
            router.push(`/barn/product/${productId.value}`);
        }
    },
    { label: 'Taxrirlash', icon: 'pi pi-refresh' },
    { label: "O'chirish", icon: 'pi pi-trash' },
    { separator: true },
    { label: 'Home', icon: 'pi pi-home' }
]);
</script>
