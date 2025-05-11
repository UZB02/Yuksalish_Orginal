<template>
    <DataTable :value="props.data" tableStyle="min-width: 50rem">
           <Column header="ID">
        <template #body="slotProps">
            {{ slotProps.index + 1 }}
        </template>
    </Column>
        <Column field="firstName" header="Ism" />
        <Column field="lastName" header="Familiya" />

        <Column field="phoneNumber" header="Tell">
            <template #body="slotProps">
                <a v-tooltip.top="'Qo‘ng‘iroq qilish'" :href="'tel:' + slotProps.data.phoneNumber" class="text-blue-800 hover:underline dark:text-white">
                    {{ slotProps.data.phoneNumber }}
                </a>
            </template>
        </Column>
        <Column field="email" header="Email" />

        <Column header="Amallar">
            <template #body="slotProps">
                <div class="flex gap-3">
                    <button v-tooltip.top="'O‘chirish'" @click="openDeletModal(slotProps.data)">
                        <i class="pi pi-trash text-red-500 mr-2"></i>
                    </button>
                    <button v-tooltip.top="'Taxrirlash'" @click="openEditModal(slotProps.data)">
                        <i class="pi pi-pencil"></i>
                    </button>
                </div>
            </template>
        </Column>
    </DataTable>

    <!-- Begin Edit Modal -->
     <Drawer v-model:visible="visibleEditAdmin" header="Taxrirlash" position="right" class="!w-full md:!w-96 lg:!w-[30rem]">
        <EditAdmin :admin="admin" @refreshFunction="refreshFunction()"></EditAdmin>
    </Drawer>
    <!-- End Edit Modal -->
     <!--Begin Delete Modal -->
    <Dialog header="O'chirish" v-model:visible="deletModal" :style="{ width: '350px' }" :modal="true">
        <div class="flex items-center justify-center">
            <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
            <span>{{ admin.firstName }} ni o'chirishga ishonchingiz komilmi?</span>
        </div>
        <template #footer>
            <Button label="Yo'q" icon="pi pi-times" @click="deletModal=false" text severity="secondary" />
            <Button :label="isloading ? 'Loading...' : 'O\'chirish'" icon="pi pi-trash" @click="deleteAdminById()" severity="danger" outlined autofocus />
        </template>
    </Dialog>
    <!--End Delete Modal -->
</template>

<script setup>
import axios from 'axios';
import { defineProps,defineEmits, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
import EditAdmin from './EditAdmin.vue'

const props = defineProps({
    data: { type: Array, required: true },
});

const emits=defineEmits(['getAdmins'])


// State
const visibleEditAdmin=ref(false)
const deletModal=ref(false)
const isloading=ref(false)
const admin=ref({})

const openDeletModal=(item)=>{
    admin.value=item
    deletModal.value=true
}
const openEditModal=(item)=>{
    admin.value=item
    visibleEditAdmin.value=true
}

const deleteAdminById = async () => {
    isloading.value=true
    try {
        await axios.delete(`/api/admin/${admin.value._id}`);
              toast.add({ severity: 'success', summary: "O'chirildi", detail: "Admin o'chirildi", life: 3000 });
         emits('getAdmins');
    } catch (err) {
        console.error('O‘chirishda xatolik:', err);
    }finally{
        deletModal.value=false
        isloading.value=false
    }
};

const refreshFunction=()=>{
   emits('getAdmins')
    visibleEditAdmin.value=false
}
</script>

<style scoped>
/* Optional styles */
</style>
