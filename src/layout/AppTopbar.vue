<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/stores/useAuthStore.js';
import { ref } from 'vue';
import Logo from '../../public/Logo.vue';
import AppConfigurator from './AppConfigurator.vue';
const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const visible = ref(false);

const authStore = useAuthStore();
const logout = () => {
    authStore.logout();
    visible.value=false
};
</script>

<template>
    <div class="layout-topbar shadow">
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
                    <!-- <div class="flex gap-2 items-center">
                        <i class="pi pi-user"></i>
                        <div class="flex flex-col">
                            <span>{{authStore.user.firstName+ ' ' + authStore.user.lastName}}</span>
                        <span>{{authStore.user.email}}</span>
                        </div>
                    </div> -->
                    <button @click="visible=true" type="button" class="layout-topbar-action">
                        <i class="pi pi-sign-out" style="font-size: 15px"></i>
                        <span>Tizimdan chiqish</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Begin view logout -->
  <Dialog
  v-model:visible="visible"
  modal
  header="Chiqish"
  :style="{ width: '30vw' }"
  :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
>
  <div class="text-center p-4">
    <i class="pi pi-exclamation-triangle text-red-500 mb-4" style="font-size: 3rem;"></i>
    <h2 class="text-xl font-semibold mb-2">Chiqmoqchimisiz?</h2>
    <p class="text-gray-600 mb-4">Hisobingizdan chiqishni xohlaysizmi?</p>

    <div class="grid grid-cols-2 gap-3 mt-4">
      <Button
        label="Bekor qilish"
        icon="pi pi-times"
        class="p-button-secondary"
        @click="visible = false"
      />
      <Button
        label="Chiqish"
        icon="pi pi-sign-out"
        class="p-button-danger"
        @click="logout()"
      />
    </div>
  </div>
</Dialog>

    <!-- End view logout -->
</template>
