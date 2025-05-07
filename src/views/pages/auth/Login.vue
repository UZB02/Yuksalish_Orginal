<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '../../../../public/Logo.vue';
import { useAuthStore } from '../../../stores/useAuthStore';
const authStore = useAuthStore();
const router = useRouter();
const email = ref('');
const password = ref('');

const checked = ref(false);

const loadinLogin = ref(false);

const login = async () => {
    loadinLogin.value = true;
    try {
        const res = await authStore.login(email.value, password.value);
        if (res.status == 200) {
            router.push('/');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            loadinLogin.value = false;
        }
        if (res.status == 401 || res.status == 404) {
            loadinLogin.value = false;
            alert("Qaytadan urinib ko'ring");
        }
    } catch (error) {
        loadinLogin.value = false;
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center flex flex-col items-center gap-2 mb-8">
                        <Logo></Logo>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Yuksalish</div>
                        <span class="text-muted-color font-medium">Boshlash uchun kirish</span>
                    </div>

                    <form @submit.prevent="login()">
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" size="large" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Parol</label>
                        <Password id="password1" v-model="password" size="large" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Menga eslat</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Parolni unutdingizmi?</span>
                        </div>
                        <Button :label="loadinLogin ? 'Loading...' : 'Kirish'" type="submit" class="w-full" @click="login"></Button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
