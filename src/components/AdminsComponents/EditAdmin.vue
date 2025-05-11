<template>
    <form class="grid grid-cols-1 gap-4">
        <span class="grid gap-2">
            <label for="Name">Ism</label>
            <InputText type="text" id="Name" v-model="editAdmin.firstName" />
        </span>
        <span class="grid gap-2">
            <label for="lastName">Familiya</label>
            <InputText type="text" id="lastName" v-model="editAdmin.lastName" />
        </span>
        <span class="grid gap-2">
            <label for="phoneNumber">Tell</label>
            <InputMask id="phoneNumber" v-model="editAdmin.phoneNumber" mask="+999999999999" placeholder="+998999999999" class="w-full" />
        </span>
        <span class="grid gap-2">
            <label for="email">Email</label>
            <InputText type="text" id="email" v-model="editAdmin.email" autocomplete="email  " />
        </span>
        <span class="grid gap-2">
            <label for="password">Parol</label>
            <Password
                v-model="editAdmin.password"
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
        <Button size="large" @click="editAdminById()" :disabled="isloading" :label="isloading ? 'Loading...' : 'Taxrirlash'"></Button>
    </form>
</template>
<script setup>
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, reactive, ref } from 'vue';
const toast = useToast();

const emits = defineEmits(['refreshFunction']);
const props = defineProps({
    admin: { type: Object, required: true }
});
console.log(props.admin);
const isloading = ref(false);
const editAdmin = reactive({
    firstName: props.admin.firstName,
    lastName: props.admin.lastName,
    email: props.admin.email,
    phoneNumber: props.admin.phoneNumber
});

const editAdminById = async () => {
    isloading.value = true;
    try {
        const payload = { ...editAdmin };
        if (!payload.password) {
            delete payload.password;
        }
        await axios.put(`/api/admin/${props.admin._id}`, payload);

        toast.add({ severity: 'success', summary: 'Success', detail: 'Admin taxrirlandi!', life: 3000 });
        emits('refreshFunction');
    } catch (error) {
        console.log(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Taxrirlashda xatolik', life: 3000 });
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
