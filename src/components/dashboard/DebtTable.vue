<template>
    <div class="card">
        <span class="flex justify-between items-center">
            <h1 class="text-xl">Aralshmadagi qarzdorlar</h1>
            <h1 class="text-xl">{{ formatCurrency(totalDebt) }}</h1>
        </span>
        <DataTable :value="deptors" tableStyle="min-width: 80rem">
            <Column field="createdAt" header="Sana">
                <template #body="slotProps">
                    {{ new Date(slotProps.data.createdAt).toLocaleDateString() }}
                </template>
            </Column>

            <Column field="fullName" header="Haridor"></Column>

            <Column field="clientPhoneNumber" header="Tell">
                <template #body="slotProps">
                    <a v-tooltip.top="`Qo'ng'iroq qilish`" :href="'tel:' + slotProps.data.clientPhoneNumber" class="text-blue-800 hover:underline dark:text-white">
                        {{ slotProps.data.clientPhoneNumber }}
                    </a>
                </template>
            </Column>

            <Column header="Mahsulot">
                <template #body="slotProps">
                    {{ slotProps.data.mix?.title || '—' }}
                </template>
            </Column>

            <Column field="size" header="Kg">
                <template #body="slotProps"> {{ slotProps.data.size }} Kg </template>
            </Column>

            <Column field="payed" header="To'langan">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.payed) }}
                </template>
            </Column>

            <Column field="debt" header="Qarz">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.debt) }}
                </template>
            </Column>

            <Column field="totalPrice" header="Jami">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.totalPrice) }}
                </template>
            </Column>

            <Column header="Amallar">
                <template #body="slotProps">
                    <Button label="To'lash" icon="pi pi-wallet" @click="toggleModal(slotProps.data)" size="small" />
                </template>
            </Column>
        </DataTable>
    </div>

    <!-- Begin Payed Modal -->
    <Dialog v-model:visible="visible" modal header="Qarzni to‘lash" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Qarzni to‘lash oynasi</span>

        <div class="flex items-center gap-4 mb-4">
            <label class="font-semibold w-24">F.I.Sh</label>
            <InputText v-model="payed.fullName" class="flex-auto" disabled />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label class="font-semibold w-24">Qarz</label>
            <InputText :value="formatCurrency(payed.debt)" class="flex-auto" disabled />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label class="font-semibold w-24">To‘lash</label>
            <InputText v-model="payedAmount" type="number" class="flex-auto" />
        </div>

        <div class="flex justify-end gap-2">
            <Button type="button" label="Bekor qilish" severity="secondary" @click="visible = false" />
            <Button type="button" label="To'lash" @click="handlePay()" />
        </div>
    </Dialog>
    <!-- End Payed Modal -->
</template>

<script setup>
import formatCurrency from '@/utils/PriceFormatter';
import axios from 'axios';
import { defineProps, ref, watch } from 'vue';

const props = defineProps({
    date: {
        type: Date,
        required: true
    }
});

const payed = ref({});
const payedAmount = ref(0);
const visible = ref(false);
const deptors = ref([]);
const totalDebt = ref(null);

const fetchDebetdata = async () => {
    try {
        const year = props.date.getFullYear();
        const month = props.date.getMonth() + 1;

        const res = await axios.get(`/api/statistics/debtors-mix?year=${year}&month=${month}`);
        deptors.value = res.data.debtors || [];
        totalDebt.value = res.data.totalDebt;
    } catch (err) {
        console.log(err);
    }
};
fetchDebetdata();

const toggleModal = (item) => {
    visible.value = true;
    payed.value = item;
    payedAmount.value = 0;
};

const handlePay = async () => {
    try {
        await axios.patch(`/api/mix/${payed.value._id}/payDebt`, {
            amount: Number(payedAmount.value)
        });
        visible.value = false;
        fetchDebetdata();
    } catch (err) {
        console.error('To‘lovda xatolik:', err);
    }
};

watch(
    () => props.date,
    () => {
        fetchDebetdata();
    }
);
</script>

<style scoped>
.card {
    padding: 15px;
    margin: 0;
}
h1 {
    margin: 0;
}
</style>
