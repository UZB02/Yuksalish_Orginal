<template>
    <div class="relative overflow-x-auto shadow-md rounded">
        <!--Begin Skeleton loading table -->
        <DataTable v-if="loadingProduct" :value="Array(5).fill({})" scrollable tableStyle="min-width: 1800px">
            <Column header="Haridor">
                <template #body>
                    <Skeleton width="100px" height="1rem" />
                </template>
            </Column>
            <Column header="Tell">
                <template #body>
                    <Skeleton width="100px" height="1rem" />
                </template>
            </Column>
            <Column header="Sotilgan Mahsulot">
                <template #body>
                    <Skeleton width="80px" height="1rem" />
                </template>
            </Column>
            <Column header="Sotilish Narxi">
                <template #body>
                    <Skeleton width="100px" height="1rem" />
                </template>
            </Column>
            <Column header="Tannarxi">
                <template #body>
                    <Skeleton width="100px" height="1rem" />
                </template>
            </Column>
            <Column header="Tushkan Summa">
                <template #body>
                    <Skeleton width="120px" height="1rem" />
                </template>
            </Column>
            <Column header="Tushkan Foyda">
                <template #body>
                    <Skeleton width="120px" height="1rem" />
                </template>
            </Column>
            <Column header="Sotilgan Vaqti">
                <template #body>
                    <Skeleton width="150px" height="1rem" />
                </template>
            </Column>
            <Column header="Amallar">
                <template #body>
                    <Skeleton shape="circle" size="2rem" class="mr-2" />
                    <Skeleton shape="circle" size="2rem" />
                </template>
            </Column>
        </DataTable>
        <!--End Skeleton loading table -->
        <DataTable v-else ref="tableRef" :value="productHistory?.history ? productHistory?.history : []" scrollable tableStyle="min-width: 1800px">
            <Column field="name" header="Haridor"></Column>
            <Column field="clientPhoneNumber" header="Tell">
                <template #body="slotProps">
                    <a v-tooltip.top="`Qo'ng'iroq qilish`" :href="'tel:' + slotProps.data.clientPhoneNumber" class="text-blue-800 hover:underline dark:text-white">
                        {{ slotProps.data.clientPhoneNumber }}
                    </a>
                </template>
            </Column>
            <Column field="size" header="Sotilgan Mahsulot">
                <template #body="slotProps"> {{ slotProps.data.size }} Kg </template>
            </Column>
            <Column field="costPrice" header="Tannarxi">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.costPrice) }}
                </template>
            </Column>
            <Column field="sellingPrice" header="Sotilish Narxi">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.sellingPrice) }}
                </template>
            </Column>

            <Column field="totalPrice" header="Tushkan summa">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.totalPrice) }}
                </template>
            </Column>
            <Column field="totalPrice" header="To'langan summa">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.payed) }}
                </template>
            </Column>
            <Column field="profit" header="Foyda">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.profit) }}
                </template>
            </Column>
            <Column field="createdAt" header="Sotilgan Vaqti">
                <template #body="slotProps">
                    {{ formatDateTime(slotProps.data.createdAt) }}
                </template>
            </Column>
            <Column header="Amallar">
                <template #body="slotProps">
                    <div class="flex gap-3">
                        <button v-tooltip.top="'O\'chirish'" @click="deletProductHistoryModal(slotProps.data)">
                            <i class="pi pi-trash text-red-500 mr-2"></i>
                        </button>
                        <button v-tooltip.top="'Tafsilot'" @click="viewDescription(slotProps.data)">
                            <i class="pi pi-eye"></i>
                        </button>
                    </div>
                </template>
            </Column>
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-end flex gap-2 pb-4">
                        <Button @click="SellProductModalOpen(product.data)" :disabled="product.data.size == 0" class="col-span-2 sm:col-span-4 md:col-span-3 xl:col-span-2 flex items-center gap-2">
                            <i class="pi pi-cart-minus"></i>
                            <span class="hidden sm:inline">Sotish</span>
                        </Button>
                        <Button
                            v-tooltip.top="'Excelga yuklash'"
                            severity="secondary"
                            @click="exportToExcel(productHistory.history, product.data.name)"
                            class="col-span-2 sm:col-span-4 md:col-span-3 xl:col-span-2 flex items-center gap-2"
                            :disabled="productHistory === null"
                        >
                            <i class="pi pi-download"></i>
                            <span class="hidden sm:inline">Yuklash</span>
                        </Button>
                    </div>
                    <div class="text-end pb-4">
                        <DatePicker :showIcon="true" iconDisplay="button" :showButtonBar="true" v-tooltip.top="'Sana bo\'yicha qidirish'" v-model="date" @input="getProductHistory()" class="w-full lg:w-44"></DatePicker>
                    </div>
                </div>
            </template>
        </DataTable>
    </div>
    <!--Begin Delete Modal -->
    <Dialog header="O'chirish" v-model:visible="deletModal" :style="{ width: '350px' }" :modal="true">
        <div class="flex items-center justify-center">
            <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
            <span>O'chirishga ishonchingiz komilmi?</span>
        </div>
        <template #footer>
            <Button label="Yo'q" icon="pi pi-times" @click="deletModal = false" text severity="secondary" />
            <Button :label="isloading ? 'Loading...' : 'O\'chirish'" icon="pi pi-trash" @click="deleteProductHistory()" severity="danger" outlined autofocus />
        </template>
    </Dialog>
    <!--End Delete Modal -->
    <!-- Paginator -->
    <Paginator :rows="limit" :totalRecords="totalItems" :rowsPerPageOptions="[5, 10, 20, 30]" @page="onPageChange" />

    <!--Begin Modal View -->
    <Dialog header="Tafsilot" v-model:visible="viewVisible" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
        <h3 class="text-lg font-semibold">{{ viewProduct?.name }}</h3>
        <p class="mt-4">{{ viewProduct?.description || 'Tafsilotlar mavjud emas!' }}</p>
        <template #footer>
            <Button severity="danger" label="Yopish" @click="viewVisible = false" />
        </template>
    </Dialog>
    <!-- End Modal View -->

    <!-- Begin SellProduct Modal -->
    <Drawer v-model:visible="visibleSellProduct" :header="product.data.name + ` ` + `dan sotish`" position="right" class="!w-full md:!w-96 lg:!w-[30rem]">
        <SellProduct :product="product.data" @refreshGetProductFunction="refreshGetProductFunction"></SellProduct>
    </Drawer>
    <!-- End SellProduct Modal -->
    <!-- Toast -->
    <Toast />
</template>

<script setup>
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import formatDateTime from '../../utils/DateTimeFormatter';
import exportToExcel from '../../utils/ExcelFormatter';
import formatCurrency from '../../utils/PriceFormatter';
import SellProduct from './BarnProduct/SellProduct.vue';
const emits = defineEmits(['getProduct']);

const product = defineProps({
    data: {
        type: Object,
        required: true
    }
});
const id = useRoute().params.id;
const productHistory = ref(null);
const page = ref(1);
const limit = ref(5);
const totalItems = ref(0);
const viewVisible = ref(false);
const deletModal = ref(false);
const viewProduct = ref(null);
const isloading = ref(false);
const loadingProduct = ref(true);
const delProduct = ref({});
const toast = useToast();
const tableRef = ref(null);
const date = ref();
const visibleSellProduct = ref(false);

const getProductHistory = async () => {
    try {
        let dateParam = '';
        let day = '';
        let month = '';
        let year = '';
        if (date.value instanceof Date) {
            day = String(date.value.getDate()).padStart(2, '0'); // 01
            month = String(date.value.getMonth() + 1).padStart(2, '0'); // 04 (0-based, shuning uchun +1)
            year = date.value.getFullYear(); // 2025
            dateParam = `&day=${day}&month=${month}&year=${year}`;
        }
        const response = await axios.get(`/api/product-history/${id}?page=${page.value}&limit=${limit.value}${dateParam}`);
        if ((response.status = 200)) {
            loadingProduct.value = false;
            productHistory.value = response.data;
            totalItems.value = response.data.total;
        }
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Xatolik', detail: error.response.data.message, life: 3000 });
        loadingProduct.value = false;
    }
};

const deletProductHistoryModal = (item) => {
    deletModal.value = true;
    delProduct.value = item;
};
const deleteProductHistory = async () => {
    isloading.value = true;
    try {
        const res = await axios.delete(`/api/product-history/${delProduct.value._id}`);
        if ((res.status = 200)) {
            isloading.value = false;
            toast.add({ severity: 'success', summary: 'Bajarildi', detail: delProduct.value.name + ' ' + "tarixi o'chirildi", life: 3000 });
            deletModal.value = false;
            getProductHistory();
        }
    } catch (error) {
        console.error(error);
    }
};

const viewDescription = (item) => {
    viewProduct.value = item;
    viewVisible.value = true;
};

const onPageChange = (event) => {
    page.value = event.page + 1;
    limit.value = event.rows;
    getProductHistory();
};

const SellProductModalOpen = () => {
    visibleSellProduct.value = true;
};
const refreshGetProductFunction = () => {
    visibleSellProduct.value = false;
    emits('getProduct');
    getProductHistory();
};

watch(date, (newValue, oldValue) => {
    getProductHistory();
});
onMounted(getProductHistory);
</script>
