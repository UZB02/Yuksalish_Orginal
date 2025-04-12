<script setup>
import axios from 'axios';
import AuthProvider from './Provider/AuthProvider.vue';

axios.defaults.baseURL = 'https://yuksalish-node-lwj4.onrender.com';
</script>

<template>
    <AuthProvider>
        <router-view />
    </AuthProvider>
</template>

<style scoped></style>
