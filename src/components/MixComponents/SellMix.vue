<template>
    <section class="grid grid-cols-1 gap-6">
        <div class="flex justify-between">
            <span class="grid grid-cols-1 md:grid-cols-2 gap-1">
                <label>Mavjut:</label>
                <h6>{{ mix.totalKg }} Kg</h6>
            </span>
            <span class="grid grid-cols-1 md:grid-cols-2">
                <label>Tannarxi:</label>
                <h6>{{ formatCurrency(mix.basePrice) }}</h6>
            </span>
        </div>

        <div class="grid grid-cols-1 gap-4">
            <span class="grid gap-2">
                <label for="fullName">Xaridor</label>
                <InputText id="fullName" v-model="sellMix.fullName" placeholder="Xaridor Ismini Kiriting" />
            </span>
            <span class="grid gap-2">
                <label for="phoneNumber">Xaridor Raqami</label>
                <InputMask id="phoneNumber" v-model="sellMix.phoneNumber" mask="+999(99) 999-99-99" placeholder="+998(91) 999-99-99" class="w-full" />
            </span>
            <span class="grid gap-2">
                <label for="productSize">Mahsulot Hajmi (Kg)</label>
                <InputNumber id="productSize" v-model="sellMix.size" />
            </span>
            <span class="grid gap-2">
                <label for="sellingPrice">Sotish narxi (UZS)</label>
                <InputNumber id="sellingPrice" v-model="sellMix.sellingPrice" />
                <small v-if="sellMix.sellingPrice < sellMix.originalPrice" class="text-red-500"> Sotish narxi tannarxidan kam ! </small>
            </span>
            <span class="grid gap-2">
                <label for="description">Tafsilot</label>
                <Textarea id="productDescription" v-model="sellMix.description" variant="filled" rows="5" cols="30" placeholder="Tafsilot kiriting" />
            </span>
            <div class="flex items-center">
                <ToggleButton v-model="checkedNote" class="w-24" onLabel="Eslatma" offLabel="Eslatma" />
            </div>
            <div v-if="checkedNote" class="flex flex-col gap-4">
                <span class="grid gap-2">
                    <label for="datepicker-24h" class="font-bold block">Eslatma vaqti</label>
                    <DatePicker id="datepicker-24h" v-model="sellProductNote.timeNote" showTime hourFormat="24" fluid />
                </span>
                <span class="grid gap-2">
                    <label for="buyyerNote">Haridor uchun</label>
                    <Textarea id="buyyerNote" v-model="sellProductNote.buyyerNote" variant="filled" rows="5" cols="30" placeholder="Haridor uschun eslatma kiriting" />
                </span>
                <span class="grid gap-2">
                    <label for="adminNote">Sotuvchi uchun</label>
                    <Textarea id="adminNote" v-model="sellProductNote.adminNote" variant="filled" rows="5" cols="30" placeholder="Sotuvchi uschun eslatma kiriting" />
                </span>
            </div>
            <Button @click="sellProductfunction" size="large" :label="isloading ? 'Loading...' : 'Sotish'" />
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
const toast = useToast();

const emits = defineEmits(['refreshGetProductFunction']);
const props = defineProps({
    mix: { type: Object, required: true }
});

const mix = props.mix;
const isloading = ref(false);
const checkedNote = ref(false);

const sellMix = ref({
    fullName: '',
    mixId: mix._id,
    size: null,
    sellingPrice: mix.sellingPrice,
    originalPrice: mix.originalPrice,
    phoneNumber: '',
    currency: 'UZS',
    description: ''
});

const sellProductNote = ref({
    buyyerNote: '',
    adminNote: '',
    timeNote: ''
});

const sellProductfunction = async () => {
    if (sellMix.value.fullName == '' || sellMix.value.sellingPrice == '' || sellMix.value.size == null) {
        toast.add({ severity: 'error', summary: 'Xatolik', detail: "Maydonlarni to'ldiring", life: 3000 });
        return;
    }
    isloading.value = true;
    try {
        const res = await axios.post(`/api/product-history`, {
            name: sellMix.value.fullName,
            mixId: sellMix.value.mixId,
            size: sellMix.value.size,
            sellingPrice: sellMix.value.sellingPrice,
            originalPrice: sellMix.value.originalPrice,
            phoneNumber: sellMix.value.phoneNumber,
            currency: sellMix.value.currency,
            description: sellMix.value.description,
            totalAmount: sellMix.value.sellingPrice * sellMix.value.size,
            profit: sellMix.value.sellingPrice * sellMix.value.size - sellMix.value.originalPrice * sellMix.value.size
        });
        if (res.status === 201) {
            toast.add({ severity: 'success', summary: 'Bajarildi', detail: 'Mahsulot Sotildi', life: 3000 });
            emits('refreshGetProductFunction');
        }
    } catch (error) {
        console.error('Xatolik:', error);
        toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Mahsulot sotishda xato yuz berdi.', life: 3000 });
    } finally {
        isloading.value = false;
    }
};

watch(sellMix, (newValue) => {
    sellProductNote.value.buyyerNote = `Yuksalish Bedana yemlari ga ${newValue.size} Kg ${product.name} uchun ${formatCurrency(newValue.sellingPrice * newValue.size)} to'lov qilish vaqtingiz keldi!`;
    sellProductNote.value.adminNote = `${newValue.fullName} dan ${newValue.size} Kg ${product.name} uchun ${formatCurrency(newValue.sellingPrice * newValue.size)} to'lov olish vaqti keldi`;
}, { deep: true });
</script>

<style scoped>
h6 {
    margin: 0;
}
</style>
