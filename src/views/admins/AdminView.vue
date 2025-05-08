<script setup>
import { ref } from 'vue';

const data = ref([
    { code: '1', name: 'Alisher Nazaraliyev', phone: 'phone 1', email: 'admin@gmail.com' },
    { code: '2', name: 'Product 2', phone: 'phone 2', email: 'admin@gmail.com' },
    { code: '3', name: 'Product 3', phone: 'phone 3', email: 'admin@gmail.com' }
]);

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
</script>

<template>
    <main>
        <DataTable :value="data" tableStyle="min-width: 50rem">
            <Column field="code" header="№"></Column>
            <Column field="name" header="Ism Familiya"></Column>
            <Column field="phone" header="Phone"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="code" header="Edit">
                <template #body> <Button icon="pi pi-trash" severity="danger" size="small" /> </template
            ></Column>
        </DataTable>
    </main>
</template>
