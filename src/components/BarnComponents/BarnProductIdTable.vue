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
            <Column field="phone" header="Tell"></Column>
            <Column field="size" header="Sotilgan Mahsulot">
                <template #body="slotProps"> {{ slotProps.data.size }} Kg </template>
            </Column>
            <Column field="sellingPrice" header="Sotilish Narxi">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.sellingPrice) }}
                </template>
            </Column>
            <Column field="originalPrice" header="Tannarxi">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.originalPrice) }}
                </template>
            </Column>
            <Column field="totalAmount" header="Tushkan Summa">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.totalAmount) }}
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
                    <button @click="deletProductHistoryModal(slotProps.data)">
                        <i class="pi pi-trash text-red-500 mr-2"></i>
                    </button>
                    <button @click="viewDescription(slotProps.data)">
                        <i class="pi pi-eye"></i>
                    </button>
                </template>
            </Column>
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-end flex gap-2 pb-4">
                        <Button @click="SellProductModalOpen(product.data)" class="col-span-2 sm:col-span-4 md:col-span-3 xl:col-span-2 flex items-center gap-2">
                            <i class="pi pi-cart-minus"></i>
                            <span class="hidden sm:inline">Sotish</span>
                        </Button>
                        <Button severity="secondary" @click="exportToExcel(productHistory.history, product.data.name)" class="col-span-2 sm:col-span-4 md:col-span-3 xl:col-span-2 flex items-center gap-2">
                            <i class="pi pi-download"></i>
                            <span class="hidden sm:inline">Yuklash</span>
                        </Button>
                    </div>
                    <div class="text-end pb-4">
                        <DatePicker v-model="date" showIcon class="w-full lg:w-44" iconDisplay="input" @input="getProductHistory()" />
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
import { defineProps, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import formatDateTime from '../../utils/DateTimeFormatter';
import exportToExcel from '../../utils/ExcelFormatter';
import formatCurrency from '../../utils/PriceFormatter';
import SellProduct from './BarnProduct/SellProduct.vue';

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
        const dateParam = date.value ? `&date=${date.value}` : '';
        const response = await axios.get(`/api/product-history/${id}?page=${page.value}&limit=${limit.value}${dateParam}`);
        if ((response.status = 200)) {
            loadingProduct.value = false;
            productHistory.value = response.data;
            totalItems.value = response.data.total;
            // console.log(productHistory.value);
        }
    } catch (error) {
        console.error(error);
    }
};

const deletProductHistoryModal = (item) => {
    deletModal.value = true;
    delProduct.value = item;
};
const deleteProductHistory = async () => {
    isloading.value = true;
    try {
        const res = await axios.delete(`/api/product-history/delete/${delProduct.value._id}`);
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

const SellProductModalOpen = (item) => {
    visibleSellProduct.value = true;
    product.value = item;
};
const refreshGetProductFunction = () => {
    visibleSellProduct.value = false;
    getProductHistory();
};

onMounted(getProductHistory);
</script>
