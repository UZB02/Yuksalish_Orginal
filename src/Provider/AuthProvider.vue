<script setup>
import { provide, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';

const authStore = useAuthStore();
const router = useRouter();

watchEffect(() => {
    authStore.initialize();

    if (!authStore.user || !authStore.token) {
        router.replace('/auth/login');
    }
});

provide('auth', authStore);
</script>

<template>
    <slot />
</template>
