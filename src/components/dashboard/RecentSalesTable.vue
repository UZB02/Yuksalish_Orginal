<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  sales: Array,
  formatDate: Function,
  formatCurrency: Function,
  iconColor: {
    type: String,
    default: 'blue'
  },
  badgeColor: {
    type: String,
    default: 'blue'
  }
});

const colorMap = {
  blue: 'primary',
  orange: 'warning',
  purple: 'help',
  green: 'success'
};

const iconColorClass = computed(() => colorMap[props.iconColor] || 'primary');
</script>

<template>
  <Card class="mb-4">
    <template #title>
      <div class="flex justify-between items-center">
        <span>{{ title }}</span>
        <Badge :value="`${sales.length} ta`" :severity="iconColorClass" />
      </div>
    </template>

    <template #content>
      <DataTable :value="sales" :scrollable="true" scrollHeight="400px" class="p-datatable-sm">
        <Column header="Sana">
  <template #body="slotProps">
    {{ formatDate(slotProps.data.createdAt) }}
  </template>
</Column>
        <Column header="Nomi">
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <Avatar
                icon="pi pi-box"
                size="small"
                :class="`p-avatar-${iconColorClass}`"
                shape="circle"
              />
              <span>{{ slotProps.data.name || slotProps.data.fullName }}</span>
            </div>
          </template>
        </Column>
        <Column header="Miqdor">
          <template #body="slotProps">
            <Badge :value="`${slotProps.data.size} kg`" :severity="iconColorClass" />
          </template>
        </Column>
        <Column header="Jami">
          <template #body="slotProps">
            <span class="font-bold text-green-600">
              {{ formatCurrency(slotProps.data.totalPrice) }}
            </span>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>
