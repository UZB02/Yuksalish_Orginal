<template>
    <div class="grid grid-cols-1 gap-2">
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
        <Button @click="editProductById()" :label="isloading ? 'Yuklanmoqda...' : 'Taxrirlash'"></Button>
    </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps ,toRaw } from "vue";
import { useToast } from 'primevue/usetoast';
import axios from "axios";

const isloading = ref(false);
const toast = useToast();
const emits = defineEmits(["getProduct"]);
const props = defineProps({ product: Object });
const editproduct = ref({
    id: null,
    name: "",
    price: null,
    currency: "UZS",
    buyyingPrice: null,
    size: null,
});

// **Mahsulotni taxrirlash uchun props orqali kelgan ma'lumotni yuklash**
// `watch` bilan `props.product` ni kuzatamiz
watch(() => props.product, (newVal) => {
    if (newVal && newVal._id) {
        editproduct.value = { ...toRaw(newVal) }; // Proxy'dan chiqarish
        editproduct.value.id = newVal._id; // ✅ ID ni alohida qo‘shamiz
    }
}, { deep: true, immediate: true });
console.log(44,props);


const editProductById= async ()=>{
    console.log(editproduct.id);
  isloading.value = true
  try{
    const res = await axios.put(`/api/product/${editproduct.value.id}`, {
      _id:editproduct.value.id,
      name: editproduct.value.name,
      size: editproduct.value.size,
      price: editproduct.value.price,
      buyyingPrice: editproduct.value.buyyingPrice,
    });
    if (res.status == 200) {
                isloading.value = false;
                toast.add({ severity: 'success', summary: 'Bajarildi', detail: message, life: 3000 });
      emits("getProduct");
      closeEditModal();
    }
  }
  catch (error) {
    isloading.value = false;
    console.log(error);
  };
}

// ✅ Formani tozalash
const resetForm = () => {
    editproduct.value = {
        id: null,
        name: "",
        price: null,
        currency: "UZS",
        buyyingPrice: null,
        size: null,
    };
    isloading.value = false;
};

// ✅ Xatolarni ko‘rsatish uchun funksiya
const handleError = (error) => {
    isloading.value = false;
    toast.add({ severity: 'error', summary: 'Xatolik', detail: '⚠️ Xatolik yuz berdi!', life: 3000 });
    console.log(error);
};

</script>

<style scoped>
</style>
