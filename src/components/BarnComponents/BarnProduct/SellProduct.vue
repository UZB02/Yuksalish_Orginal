<template>
    <section class="grid grid-cols-1 gap-6">
        <div class="flex justify-between">
            <span class="grid grid-cols-1 md:grid-cols-2 gap-1">
                <label>Mavjut:</label>
                <h6>{{ product.size }} Kg</h6>
            </span>
            <span class="grid grid-cols-1 md:grid-cols-2">
                <label>Tannarxi:</label>
                <h6>{{ formatCurrency(product.costPrice) }}</h6>
            </span>
        </div>

        <div class="grid grid-cols-1 gap-4">
            <span class="grid gap-2">
                <label for="customer">Xaridor</label>
                <InputText id="customer" v-model="sellProduct.customer" placeholder="Xaridor Ismini Kiriting" />
            </span>
            <span class="grid gap-2">
                <label for="phone">Xaridor Raqami</label>
                <InputMask id="phone" v-model="sellProduct.phone" mask="+999999999999" placeholder="+998(91) 999-99-99" class="w-full" />
            </span>
            <span class="grid gap-2">
                <label for="productSize">Mahsulot Hajmi (Kg)</label>
                <InputNumber id="productSize" v-model="sellProduct.size" />
            </span>
            <span class="grid gap-2">
                <label for="sellingPrice">Sotish narxi (UZS)</label>
                <InputNumber id="sellingPrice" v-model="sellProduct.sellingPrice" />
                <small v-if="sellProduct.sellingPrice < sellProduct.costPrice" class="text-red-500"> Sotish narxi tannarxidan kam ! </small>
            </span>
            <span class="grid gap-2">
                <label for="payed">To'langan summa (UZS)</label>
                <InputNumber id="payed" v-model="sellProduct.payed" />
            </span>
            <span class="grid gap-2">
                <label for="remaining">Qolgan summa (UZS)</label>
                <InputNumber id="remaining" v-model="sellProduct.remaining" />
            </span>
            <span class="grid gap-2">
                <label for="description">Tafsilot</label>
                <Textarea id="productDescription" v-model="sellProduct.description" variant="filled" rows="5" cols="30" placeholder="Tafsilot kiriting" />
            </span>
            <!-- <div class="flex items-center">
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
            </div> -->
            <Button @click="sellProductfunction" size="large" :label="isloading ? 'Loading...' : 'Sotish'" />
        </div>
    </section>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore.js';
import formatCurrency from '@/utils/PriceFormatter';
import axios from 'axios';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, ref, watch } from 'vue';
const toast = useToast();
const authStore = useAuthStore();

const emits = defineEmits(['refreshGetProductFunction']);
const props = defineProps({
    product: { type: Object, required: true }
});

const product = props.product;
const isloading = ref(false);
const checkedNote = ref(false);

const sellProduct = ref({
    customer: '',
    productId: product._id,
    size: null,
    sellingPrice: product.sellingPrice,
    costPrice: product.costPrice,
    phone: '',
    currency: 'UZS',
    description: '',
    payed: '',
    remaining: '',
    sellerPhoneNumber: authStore.user.phoneNumber
});

const sellProductNote = ref({
    buyyerNote: '',
    adminNote: '',
    timeNote: '',
    timestamp:null
});

const sellProductfunction = async () => {
    console.log(sellProduct.value);
    if (sellProduct.value.customer == '' || sellProduct.value.sellingPrice == '' || sellProduct.value.size == null) {
        toast.add({ severity: 'error', summary: 'Xatolik', detail: "Maydonlarni to'ldiring", life: 3000 });
        return;
    }
    isloading.value = true;
    try {
        const res = await axios.post(`/api/product-history`, {
            name: sellProduct.value.customer,
            productId: sellProduct.value.productId,
            size: sellProduct.value.size,
            sellingPrice: sellProduct.value.sellingPrice,
            costPrice: sellProduct.value.costPrice,
            clientPhoneNumber: sellProduct.value.phone,
            sellerPhoneNumber: sellProduct.value.sellerPhoneNumber,
            currency: sellProduct.value.currency,
            description: sellProduct.value.description,
            totalPrice: sellProduct.value.sellingPrice * sellProduct.value.size,
            profit: sellProduct.value.sellingPrice * sellProduct.value.size - sellProduct.value.costPrice * sellProduct.value.size,
            reminder: {
                time: sellProductNote.value.timestamp,
                messageForBuyer: sellProductNote.value.buyyerNote,
                messageForSeller: sellProductNote.value.adminNote
            }
        });
        if (res.status === 201) {
            console.log(res);
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

watch(
    sellProduct,
    (newValue) => {
        const total = newValue.sellingPrice * newValue.size || 0;
        const payed = Number(newValue.payed) || 0;
        sellProduct.value.remaining = total - payed;
        sellProductNote.value.buyyerNote = `Yuksalish Bedana yemlari dan ${formatCurrency(newValue.sellingPrice * newValue.size)} lik ${newValue.size} Kg ${product.name} oldingiz! To'langan summa ${formatCurrency(newValue.payed)}, qolgan summa ${formatCurrency(newValue.remaining)}`;
        sellProductNote.value.adminNote = `${newValue.customer} ga ${newValue.size} Kg ${product.name} sotildi. Jami summa: ${formatCurrency(newValue.sellingPrice * newValue.size)}, to'langan summa:${formatCurrency(newValue.payed)}, qolgan summa ${formatCurrency(newValue.remaining)}`;
    },
    { deep: true }
);

// `timeNote` o'zgarganida avtomatik timestampga o'tkazamiz
watch(() => sellProductNote.value.timeNote, (newVal) => {
  if (newVal instanceof Date) {
    sellProductNote.value.timestamp = newVal.getTime()
  } else {
    sellProductNote.value.timestamp = null
  }
})
</script>

<style scoped>
h6 {
    margin: 0;
}
</style>
