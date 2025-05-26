<template>
    <section class="grid grid-cols-1 gap-6">
        <div class="flex justify-between">
            <span class="grid grid-cols-1 md:grid-cols-2 gap-1">
                <label>Mavjut:</label>
                <h6>{{ mix.totalKg }} Kg</h6>
            </span>
            <span class="grid grid-cols-1 md:grid-cols-2">
                <label>Tannarxi:</label>
                <h6>{{ formatCurrency(mix.costPrice) }}</h6>
            </span>
        </div>

        <div class="grid grid-cols-1 gap-4">
            <span class="grid gap-2">
                <label for="fullName">Xaridor <span class="text-red-500">*</span></label>
                <InputText id="fullName" v-model="sellMix.fullName" placeholder="Xaridor Ismini Kiriting" />
            </span>
            <span class="grid gap-2">
                <label for="clientPhoneNumber">Xaridor Raqami <span class="text-red-500">*</span></label>
                <InputMask id="clientPhoneNumber" v-model="sellMix.clientPhoneNumber" mask="+999(99) 999-99-99" placeholder="+998(91) 999-99-99" class="w-full" />
            </span>
            <span class="grid gap-2">
                <label for="mixSize">Mahsulot Hajmi (Kg) <span class="text-red-500">*</span></label>
                <InputNumber id="mixSize" v-model="sellMix.size" />
            </span>
            <span class="grid gap-2">
                <label for="sellingPrice" class="flex gap-2">Sotish narxi (UZS) <span class="text-red-500">*</span><span>Tannarxi: {{formatCurrency(mix.costPrice)}}</span></label>
                <InputNumber id="sellingPrice" v-model="sellMix.sellingPrice" />
                <small v-if="sellMix.sellingPrice < sellMix.costPrice" class="text-red-500"> Sotish narxi tannarxidan kam ! </small>
            </span>
            <span class="grid gap-2">
                <label for="payed">To'langan summa (UZS)  <span class="text-red-500">*</span></label>
                <InputNumber id="payed" v-model="sellMix.payed" />
            </span>
            <span class="grid gap-2">
                <label for="payed">Qolgan summa (UZS) <span class="text-red-500">*</span></label>
                <InputNumber id="payed" v-model="sellMix.remaining" />
            </span>
            <!-- sms -->
            <div>
                <span class="grid gap-2">
                    <label for="buyyerNote">Haridor uchun</label>
                    <Textarea id="buyyerNote" v-model="sellSMS.buyyerNote" variant="filled" rows="5" cols="30" placeholder="Haridor uschun eslatma kiriting" />
                </span>
                <span class="grid gap-2 mt-2">
                    <label for="adminNote">Sotuvchi uchun</label>
                    <Textarea id="adminNote" v-model="sellSMS.adminNote" variant="filled" rows="5" cols="30" placeholder="Sotuvchi uschun eslatma kiriting" />
                </span>
            </div>
            <span class="grid gap-2">
                <label for="description">Tafsilot</label>
                <Textarea id="mixDescription" v-model="sellMix.description" variant="filled" rows="5" cols="30" placeholder="Tafsilot kiriting" />
            </span>
            <div class="flex items-center">
                <ToggleButton v-model="checkedNote" class="w-24" onLabel="Eslatma" offLabel="Eslatma" />
            </div>
            <div v-if="checkedNote" class="flex flex-col gap-4">
                <span class="grid gap-2">
                    <label for="datepicker-24h" class="font-bold block">Eslatma vaqti</label>
                    <DatePicker id="datepicker-24h" v-model="sellmixNote.timeNote" showTime hourFormat="24" fluid />
                </span>
                <span class="grid gap-2">
                    <label for="buyyerNote">Haridor uchun</label>
                    <Textarea id="buyyerNote" v-model="sellmixNote.buyyerNote" variant="filled" rows="5" cols="30" placeholder="Haridor uschun eslatma kiriting" />
                </span>
                <span class="grid gap-2">
                    <label for="adminNote">Sotuvchi uchun</label>
                    <Textarea id="adminNote" v-model="sellmixNote.adminNote" variant="filled" rows="5" cols="30" placeholder="Sotuvchi uschun eslatma kiriting" />
                </span>
            </div>
            <Button @click="sellmixfunction" size="large" :label="isloading ? 'Loading...' : 'Sotish'" />
        </div>
    </section>
</template>

<script setup>
import formatCurrency from '@/utils/PriceFormatter';
import axios from 'axios';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore.js';
const authStore = useAuthStore();
const toast = useToast();

const emits = defineEmits(['refreshGetMixFunction']);
const props = defineProps({
    mix: { type: Object, required: true }
});

const mix = props.mix;
const isloading = ref(false);
const checkedNote = ref(false);
console.log(mix);

const sellMix = ref({
    fullName: '',
    mixId: mix._id,
    size: null,
    sellingPrice: mix.sellingPrice,
    costPrice: mix.costPrice,
    clientPhoneNumber: '',
    sellerPhoneNumber:authStore.user.phoneNumber,
    description: '',
    payed: '',
    remaining: '',
    // profit:'',
    // totalAmount:''
    // currency: 'UZS',
});

const sellSMS = ref({
    adminNote: '',
    buyyerNote: ''
});

const sellmixNote = ref({
    buyyerNote: '',
    adminNote: '',
    timeNote: ''
});

const sellmixfunction = async () => {
    if (sellMix.value.fullName == '' || sellMix.value.sellingPrice == '' || sellMix.value.size == null) {
        toast.add({ severity: 'error', summary: 'Xatolik', detail: "Maydonlarni to'ldiring", life: 3000 });
        return;
    }
    isloading.value = true;
    try {
        const res = await axios.post(`/api/mix/sell`, {
            fullName: sellMix.value.fullName,
            mixId: sellMix.value.mixId,
            size: sellMix.value.size,
            sellingPrice: sellMix.value.sellingPrice,
            costPrice: sellMix.value.costPrice,
            clientPhoneNumber: sellMix.value.clientPhoneNumber,
            sellerPhoneNumber:sellMix.value.sellerPhoneNumber,
            description: sellMix.value.description,
            payed: sellMix.value.payed
            // currency: sellMix.value.currency,
            // totalAmount: sellMix.value.sellingPrice * sellMix.value.size,
            // profit: sellMix.value.sellingPrice * sellMix.value.size - sellMix.value.costPrice * sellMix.value.size
        });
        if (res.status === 201) {
            toast.add({ severity: 'success', summary: 'Bajarildi', detail: 'Mahsulot Sotildi', life: 3000 });
            emits('refreshGetMixFunction');
        }
    } catch (error) {
        console.error('Xatolik:', error);
        toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Mahsulot sotishda xato yuz berdi.', life: 3000 });
    } finally {
        isloading.value = false;
    }
};

watch(
    sellMix,
    (newValue) => {
        const total = newValue.sellingPrice * newValue.size || 0;
        const payed = Number(newValue.payed) || 0;
        sellMix.value.remaining = total - payed;
        sellmixNote.value.buyyerNote = `Yuksalish Bedana yemlari ga ${newValue.size} Kg ${mix.title} uchun ${formatCurrency(sellMix.value.remaining)} to'lov qilish vaqtingiz keldi!`;
        sellmixNote.value.adminNote = `${newValue.fullName} dan ${newValue.size} Kg ${mix.title} uchun ${formatCurrency(sellMix.value.remaining)} to'lov olish vaqti keldi`;
        sellSMS.value.adminNote = `Siz  ${mix.title} dan  ${newValue.fullName} ga ${newValue.size} Kg mahsulotni  ${formatCurrency(newValue.size * newValue.sellingPrice)} ga sotdingiz.To'langan summa ${formatCurrency(payed)}. Qolgan summa  ${formatCurrency(sellMix.value.remaining)} `;
        sellSMS.value.buyyerNote = `Siz Yuksalish-farm dan ${newValue.size} kg ${mix.title} mahsuloti  sotib oldingiz.Jami summa ${formatCurrency(newValue.size * newValue.sellingPrice)}.To'langan summa ${formatCurrency(payed)}. Qolgan summa  ${formatCurrency(sellMix.value.remaining)}  `;
    },
    { deep: true }
);
</script>

<style scoped>
h6 {
    margin: 0;
}
</style>
