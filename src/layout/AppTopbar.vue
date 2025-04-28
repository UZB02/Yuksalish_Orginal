<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/stores/useAuthStore.js';
import { ref } from 'vue';
import Logo from '../../public/Logo.vue';
import AppConfigurator from './AppConfigurator.vue';
const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const date = ref(null); // Tanlangan sana

const authStore = useAuthStore();
const logout = () => {
    authStore.logout();
};
</script>

<template>
    <div class="layout-topbar border-b">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <Logo />
                <span>Yuksalish</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <!-- <DatePicker v-model="date" showIcon   /> -->
                    <DatePicker v-model="date" view="month" class="w-full lg:w-44" showIcon iconDisplay="input" dateFormat="mm/yy" />

                    <button @click="logout" type="button" class="layout-topbar-action">
                        <i class="pi pi-sign-out" style="font-size: 15px"></i>
                        <span>Tizimdan chiqish</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
