import axios from 'axios';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null,
        token: sessionStorage.getItem('authToken') || null
    }),

    actions: {
        initialize() {
            const savedUser = sessionStorage.getItem('user');
            const savedToken = sessionStorage.getItem('authToken');

            if (savedUser && savedToken) {
                this.user = JSON.parse(savedUser);
                this.token = savedToken;
            }
        },

        async login(email, password) {
            try {
                const response = await axios.post('/api/login', {
                    email: email,
                    password
                });

                this.token = response.data.token;
                this.user = response.data.user;

                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                sessionStorage.setItem('authToken', response.data.token);

                return response;
            } catch (error) {
                return error.response;
            }
        },

        logout() {
            this.token = null;
            this.user = null;

            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('user');
        },

        async fetchUser() {
            if (!this.token) return;

            try {
                const response = await axios.get('/api/user', {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });
                this.user = response.data.body;

                sessionStorage.setItem('user', JSON.stringify(response.data.body));
            } catch (error) {
                console.error('Failed to fetch user:', error);
                this.logout();
            }
        }
    }
});
