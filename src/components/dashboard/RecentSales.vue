<template>
    <div class="col-12 lg:col-6">
      <Card>
        <template #title>So'nggi mahsulot sotuvlari</template>
        <template #content>
          <DataTable :value="recentProductSales" :rows="5" :paginator="true" responsiveLayout="scroll">
            <Column field="date" header="Sana"></Column>
            <Column field="productName" header="Mahsulot"></Column>
            <Column field="quantity" header="Miqdor"></Column>
            <Column field="price" header="Narx">
              <template #body="{data}">
                {{ formatCurrency(data.price) }}
              </template>
            </Column>
            <Column field="total" header="Jami">
              <template #body="{data}">
                {{ formatCurrency(data.total) }}
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
    <div class="col-12 lg:col-6">
      <Card>
        <template #title>So'nggi aralashma sotuvlari</template>
        <template #content>
          <DataTable :value="recentMixSales" :rows="5" :paginator="true" responsiveLayout="scroll">
            <Column field="date" header="Sana"></Column>
            <Column field="mixTitle" header="Aralashma"></Column>
            <Column field="quantity" header="Miqdor"></Column>
            <Column field="price" header="Narx">
              <template #body="{data}">
                {{ formatCurrency(data.price) }}
              </template>
            </Column>
            <Column field="total" header="Jami">
              <template #body="{data}">
                {{ formatCurrency(data.total) }}
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const props = defineProps({
  recentProductSales: Array,
  recentMixSales: Array,
  formatCurrency: Function
});
</script>