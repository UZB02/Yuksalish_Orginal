<script setup>
import axios from 'axios';
import AuthProvider from './Provider/AuthProvider.vue';

const token = sessionStorage.getItem('authToken');
axios.defaults.baseURL = 'http://node.yuksalishyemlari.uz';
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
</script>

<template>
    <AuthProvider>
        <router-view />
    </AuthProvider>
</template>

<style scoped></style>
