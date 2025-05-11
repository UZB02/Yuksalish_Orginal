<template>
    <div class="flex flex-col gap-8">
        <div class="grid grid-cols-12 gap-2">
            <div class="col-span-10 sm:col-span-8 md:col-span-9 xl:col-span-10">
                <h4>Adminlar</h4>
            </div>
            <Button @click="visibleAddAdmin = true" class="col-span-2 sm:col-span-4 md:col-span-3 xl:col-span-2 flex items-center gap-2">
                <i class="pi pi-plus"></i>
                <span class="hidden sm:inline">Admin Qo'shish</span>
            </Button>
        </div>

        <div v-if="isLoading">
            <!--Begin Table Skeleton -->
            <DataTable :value="Array(5)" tableStyle="min-width: 50rem">
                <Column header="ID">
                    <template #body>
                        <Skeleton width="2rem" />
                    </template>
                </Column>
                <Column header="Ism">
                    <template #body>
                        <Skeleton width="6rem" />
                    </template>
                </Column>
                <Column header="Familiya">
                    <template #body>
                        <Skeleton width="6rem" />
                    </template>
                </Column>
                <Column header="Tell">
                    <template #body>
                        <Skeleton width="8rem" />
                    </template>
                </Column>
                <Column header="Email">
                    <template #body>
                        <Skeleton width="10rem" />
                    </template>
                </Column>
                <Column header="Amallar">
                    <template #body>
                        <div class="flex gap-2">
                            <Skeleton shape="circle" size="2rem" />
                            <Skeleton shape="circle" size="2rem" />
                        </div>
                    </template>
                </Column>
            </DataTable>
            <!--End Table Skeleton -->
        </div>
        <div v-else>
            <AdminsTable :data="data" @getAdmins="getAdmins" />
        </div>
    </div>
    <!-- Begin AddAdmin modal -->
    <Drawer v-model:visible="visibleAddAdmin" header="Admin qo'shish" position="right" class="!w-full md:!w-96 lg:!w-[30rem]">
        <AddAdmin @refreshFunction="refreshFunction"></AddAdmin>
    </Drawer>
    <!-- End AddAdmin modal -->
</template>

<script setup>
import AdminsTable from '@/components/AdminsComponents/AdminsTable.vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import AddAdmin from './../../components/AdminsComponents/AddAdmin.vue';

const data = ref([]);
const isLoading = ref(true);
const visibleAddAdmin = ref(false);

const getAdmins = async () => {
    try {
        const res = await axios.get('/api/admin');
        if (res.status === 200) {
            data.value = res.data;
            isLoading.value = false;
        }
    } catch (error) {
        console.error('Adminlarni olishda xatolik:', error);
        isLoading.value = false;
    }
};

const refreshFunction = () => {
    getAdmins();
    visibleAddAdmin.value = false;
};

onMounted(() => {
    getAdmins();
});
</script>

<style scoped>
h4 {
    margin: 0;
}
/* Optional styles */
</style>
