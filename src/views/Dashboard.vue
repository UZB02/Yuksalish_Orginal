<script setup>
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
</script>

<template>
    <div class="grid grid-cols-12 gap-2">
        <StatsWidget />

        <div class="col-span-12">
            <RevenueStreamWidget />
            <!-- <NotificationsWidget /> -->
        </div>
    </div>
</template>
