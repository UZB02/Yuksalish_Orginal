<template>
    <form class="grid grid-cols-1 gap-4">
        <span class="grid gap-2">
            <label for="Name">Ism</label>
            <InputText type="text" id="Name" v-model="newAdmin.firstName" />
        </span>
        <span class="grid gap-2">
            <label for="lastName">Familiya</label>
            <InputText type="text" id="lastName" v-model="newAdmin.lastName" />
        </span>
        <span class="grid gap-2">
            <label for="phoneNumber">Tell</label>
            <InputMask id="phoneNumber" v-model="newAdmin.phoneNumber" mask="+999999999999" placeholder="+998999999999" class="w-full" />
        </span>
        <span class="grid gap-2">
            <label for="email">Email</label>
            <InputText type="text" id="email" v-model="newAdmin.email" autocomplete="email  " />
        </span>
        <span class="grid gap-2">
            <label for="password">Parol</label>
            <Password
                v-model="newAdmin.password"
                id="password"
                toggleMask
                :feedback="true"
                :promptLabel="'Parol kiriting'"
                weakLabel="Yengil"
                mediumLabel="O‘rtacha"
                strongLabel="Kuchli"
                :inputProps="{ autocomplete: 'current-password' }"
                class="w-full"
                inputClass="w-full"
            />
        </span>
        <Button size="large" @click="addAdmin()" :disabled="isloading" :label="isloading ? 'Loading...' : 'Qo\'shish'"></Button>
    </form>
</template>
<script setup>
import axios from 'axios';
import { defineEmits, reactive, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const emits = defineEmits(['refreshFunction']);

const isloading = ref(false);
const newAdmin = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
});

const addAdmin = async () => {
    isloading.value = true;
    try {
        if (!newAdmin.firstName || !newAdmin.lastName || !newAdmin.email || !newAdmin.phoneNumber) {
            toast.add({ severity: 'error', summary: 'Xatolik', detail: '⚠️ Barcha maydonlarni to‘ldiring!', life: 3000 });
            isloading.value = false;
            return;
        } else {
            const res = await axios.post('/api/admin', newAdmin);
            if (res.status === 201) {
                toast.add({ severity: 'success', summary: 'Bajarildi', detail: "Admin qo'shildi", life: 3000 });
                emits('refreshFunction');
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        isloading.value = false;
    }
};
</script>

<style scoped>
h4 {
    margin: 0;
}
</style>
