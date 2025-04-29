<template>
    <div class="flex flex-col gap-5">
        <div class="flex items-center gap-2">
            <RouterLink to="/mix">Aralshma</RouterLink>
            <span>/</span>
            <span class="text-blue-400 cursor-pointer">{{ slug }}</span>
        </div>
        <MixSlugTable :id="slug"/>
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import MixSlugTable from '../../../components/MixComponents/MixSlug/MixSlugTable.vue';

const route = useRoute();

const slug = route.params.slug;
</script>
