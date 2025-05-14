<template>
    <div class="relative overflow-x-auto shadow-md rounded">
        <!-- Skeleton Loading -->
        <DataTable v-if="loadingmix" :value="Array(5).fill({})" scrollable tableStyle="min-width: 1800px">
            <Column header="Haridor">
                <template #body><Skeleton width="100px" height="1rem" /></template>
            </Column>
            <Column header="Tell">
                <template #body><Skeleton width="100px" height="1rem" /></template>
            </Column>
            <Column header="Sotilgan Mahsulot">
                <template #body><Skeleton width="80px" height="1rem" /></template>
            </Column>
            <Column header="Sotilish Narxi">
                <template #body><Skeleton width="100px" height="1rem" /></template>
            </Column>
            <Column header="Tannarxi">
                <template #body><Skeleton width="100px" height="1rem" /></template>
            </Column>
            <Column header="Tushkan Summa">
                <template #body><Skeleton width="120px" height="1rem" /></template>
            </Column>
            <Column header="Tushkan Foyda">
                <template #body><Skeleton width="120px" height="1rem" /></template>
            </Column>
            <Column header="Sotilgan Vaqti">
                <template #body><Skeleton width="150px" height="1rem" /></template>
            </Column>
            <Column header="Amallar">
                <template #body>
                    <Skeleton shape="circle" size="2rem" class="mr-2" />
                    <Skeleton shape="circle" size="2rem" />
                </template>
            </Column>
        </DataTable>

        <!-- Real Data Table -->
        <DataTable v-else ref="tableRef" :value="mixHistory?.history || []" scrollable tableStyle="min-width: 1800px">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="text-end flex gap-2 pb-4">
                        <Button @click="SellmixModalOpen(mix.data)" :disabled="mix.data.quantity==0" class="flex items-center gap-2">
                            <i class="pi pi-cart-minus"></i>
                            <span class="hidden sm:inline">Sotish</span>
                        </Button>
                        <Button v-tooltip.top="'Excelga yuklash'" severity="secondary"
                            @click="mixhistoryexportToExcelById(mixHistory.history, mix.data.title)"
                            class="flex items-center gap-2" :disabled="mixHistory==null">
                            <i class="pi pi-download"></i>
                            <span class="hidden sm:inline">Yuklash</span>
                        </Button>
                    </div>
                    <div class="text-end pb-4">
                        <DatePicker :showIcon="true" iconDisplay="button" :showButtonBar="true"
                            v-tooltip.top="'Sana bo\'yicha qidirish'" v-model="date"
                            @input="getMixHistoryById" class="w-full lg:w-44" />
                    </div>
                </div>
            </template>

            <Column field="fullName" header="Haridor"></Column>
            <Column field="clientPhoneNumber" header="Tell">
                <template #body="slotProps">
                    <a v-tooltip.top="`Qo'ng'iroq qilish`" :href="'tel:' + slotProps.data.clientPhoneNumber"
                        class="text-blue-800 hover:underline dark:text-white">
                        {{ slotProps.data.clientPhoneNumber }}
                    </a>
                </template>
            </Column>
            <Column field="size" header="Sotilgan Mahsulot">
                <template #body="slotProps">{{ slotProps.data.size }} Kg</template>
            </Column>
            <Column field="originalPrice" header="Tannarxi">
                <template #body="slotProps">{{ formatCurrency(slotProps.data.originalPrice) }}</template>
            </Column>
            <Column field="sellingPrice" header="Sotilish Narxi">
                <template #body="slotProps">{{ formatCurrency(slotProps.data.sellingPrice) }}</template>
            </Column>
            <Column field="size" header="Tushkan Summa">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.size * slotProps.data.sellingPrice) }}
                </template>
            </Column>
            <Column field="size" header="Foyda">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.size * (slotProps.data.sellingPrice - slotProps.data.originalPrice)) }}
                </template>
            </Column>
            <Column field="createdAt" header="Sotilgan Vaqti">
                <template #body="slotProps">{{ formatDateTime(slotProps.data.createdAt) }}</template>
            </Column>
            <Column header="Amallar">
                <template #body="slotProps">
                    <div class="flex gap-3">
                        <!-- <button v-tooltip.top="'O\'chirish'" @click="deletmixHistoryModal(slotProps.data)">
                            <i class="pi pi-trash text-red-500 mr-2"></i>
                        </button> -->
                        <button v-tooltip.top="'Tafsilot'" @click="viewDescription(slotProps.data)">
                            <i class="pi pi-eye"></i>
                        </button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>

    <!-- Delete Modal -->
    <Dialog header="O'chirish" v-model:visible="deletModal" :style="{ width: '350px' }" :modal="true">
        <div class="flex items-center justify-center">
            <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
            <span>O'chirishga ishonchingiz komilmi?</span>
        </div>
        <template #footer>
            <Button label="Yo'q" icon="pi pi-times" @click="deletModal = false" text severity="secondary" />
            <Button :label="isloading ? 'Loading...' : 'O\'chirish'" icon="pi pi-trash" @click="deletemixHistory"
                severity="danger" outlined autofocus />
        </template>
    </Dialog>

    <!-- View Modal -->
    <Dialog header="Tafsilot" v-model:visible="viewVisible" :breakpoints="{ '960px': '75vw' }" :style="{ width: '50vw' }"
        :modal="true">
        <h3 class="text-lg font-semibold">{{ viewmix?.fullName }}</h3>
        <p class="mt-4">{{ viewmix?.description || 'Tafsilotlar mavjud emas!' }}</p>
        <template #footer>
            <Button severity="danger" label="Yopish" @click="viewVisible = false" />
        </template>
    </Dialog>

    <!-- Sellmix Drawer -->
    <Drawer v-model:visible="visibleSellmix" :header="mix.data.title + ` dan sotish`" position="right"
        class="!w-full md:!w-96 lg:!w-[30rem]">
        <SellMix :mix="mix.data" @refreshGetMixFunction="refreshGetMixFunction" />
    </Drawer>

    <!-- Paginator -->
    <Paginator :rows="limit" :totalRecords="totalItems" :rowsPerPageOptions="[5, 10, 20, 30]" @page="onPageChange" />

    <!-- Toast -->
    <Toast />
</template>

<script setup>
import formatDateTime from '@/utils/DateTimeFormatter';
import formatCurrency from '@/utils/PriceFormatter';
import mixhistoryexportToExcelById from '@/utils/MixHistoryExcelFormater';
import SellMix from '../SellMix.vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const emits = defineEmits(['getMixById']);

const mix = defineProps({
    data: {
        type: Object,
        required: true
    }
});

const id = useRoute().params.slug;
const mixHistory = ref(null);
const page = ref(1);
const limit = ref(5);
const totalItems = ref(0);
const viewVisible = ref(false);
const deletModal = ref(false);
const viewmix = ref(null);
const isloading = ref(false);
const loadingmix = ref(true);
const delmix = ref({});
const toast = useToast();
const tableRef = ref(null);
const date = ref();
const visibleSellmix = ref(false);

const getMixHistoryById = async () => {
    try {
        let dateParam = '';
        if (date.value instanceof Date) {
            const day = String(date.value.getDate()).padStart(2, '0');
            const month = String(date.value.getMonth() + 1).padStart(2, '0');
            const year = date.value.getFullYear();
            dateParam = `&day=${day}&month=${month}&year=${year}`;
        }

        const response = await axios.get(`/api/mix-history/${id}?page=${page.value}&limit=${limit.value}${dateParam}`);
        if (response.status === 200) {
            loadingmix.value = false;
            mixHistory.value = response.data;
            totalItems.value = response.data.total;
            console.log(mixHistory.value);
        }
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Xatolik', detail: error?.response?.data?.message || "Server xatoligi", life: 3000 });
        loadingmix.value = false;
    }
};

const deletmixHistoryModal = (item) => {
    deletModal.value = true;
    delmix.value = item;
    console.log(delmix.value._id);
};

const deletemixHistory = async () => {
    if (!delmix.value?._id) {
        toast.add({
            severity: 'warn',
            summary: 'Ogohlantirish',
            detail: 'O‘chirish uchun ID topilmadi',
            life: 3000
        });
        return;
    } 
    isloading.value = true;
    try {
        const res = await axios.delete(`/api/mix/${delmix.value._id}`);
        if (res.status === 200) {
            toast.add({
                severity: 'success',
                summary: 'Bajarildi',
                detail: `${delmix.value.fullName || 'Tarix'} o‘chirildi`,
                life: 3000
            });
            deletModal.value = false;
            await getMixHistoryById(); // Yangilanishni kutish
        }
    } catch (error) {
        console.error(error);
        toast.add({
            severity: 'error',
            summary: 'Xatolik',
            detail: error?.response?.data?.message || 'Tarixni o‘chirishda xatolik yuz berdi',
            life: 3000
        });
    } finally {
        isloading.value = false;
    }
};

const viewDescription = (item) => {
    viewmix.value = item;
    viewVisible.value = true;
};

const onPageChange = (event) => {
    page.value = event.page + 1;
    limit.value = event.rows;
    getMixHistoryById();
};

const SellmixModalOpen = () => {
    visibleSellmix.value = true;
};

const refreshGetMixFunction = () => {
    visibleSellmix.value = false;
    emits('getMixById');
    getMixHistoryById();
};

watch(date, () => {
    getMixHistoryById();
});

onMounted(getMixHistoryById);
</script>
