<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../plugins/axios';

const router = useRouter();
const form = ref<LoginForm>({ username: '', password: '' });
const error = ref<string>('');
const formValid = ref<boolean>(false);
const showPassword = ref(false);
const passwordField = ref<HTMLInputElement | null>(null);

interface LoginForm {
    username: string;
    password: string;
}

interface LoginResponse {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    token: string;
}

const rules = {
    required: (value: string) => !!value || 'This field is required',
};

const login = async () => {
    try {
        error.value = '';
        const response = await axios.post<LoginResponse>('/api/login', form.value);
        localStorage.setItem('token', response.data.token);
        router.push('/admin/dashboard');
    } catch (err: any) {
        error.value = err.response?.data || 'Login failed. Please check your credentials.';
    }
};

const focusPassword = () => {
    if (passwordField.value) {
        passwordField.value.focus();
    }
}
</script>


<template>
    <v-card class="card-login pa-6" elevation="4">
        <v-card-title class="text-h5 text-center">Login</v-card-title>
        <v-form @submit.prevent="login" v-model="formValid">
            <v-text-field v-model="form.username" label="Username" :rules="[rules.required]" required
                @keyup.enter="focusPassword"></v-text-field>
            <v-text-field ref="passwordField" v-model="form.password" label="Password"
                :type="showPassword ? 'text' : 'password'" :rules="[rules.required]" required
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"></v-text-field>
            <v-btn type="submit" color="primary" block :disabled="!formValid" class="mt-4">Login</v-btn>
        </v-form>
        <v-alert v-if="error" type="error" class="mt-4" dismissible @input="error = ''">
            {{ error }}
        </v-alert>
        <p class="text-center mt-4">
            Don't have an account?
            <router-link to="/admin/signup">Sign Up</router-link>
        </p>
    </v-card>
</template>

<style lang="scss" scoped>
.auth-container {
    max-width: 800px;
    height: 100vh;
    padding: 40px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    .card-login {
        padding: 30px;

        input {
            width: 100%;
        }
    }
}
</style>