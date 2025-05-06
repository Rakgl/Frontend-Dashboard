<template>
    <v-card class="card-login pa-6" elevation="4">
        <v-card-title class="text-h5 text-center">Sigin</v-card-title>
        <v-form @submit.prevent="Sigin" v-model="formValid">
            <v-text-field v-model="form.first_name" label="First_name" :rules="[rules.required]"
                required></v-text-field>
            <v-text-field v-model="form.last_name" label="Last_name" :rules="[rules.required]" required></v-text-field>
            <v-text-field v-model="form.email" label="Email" :rules="[rules.required]" required></v-text-field>
            <v-text-field v-model="form.username" label="Username" :rules="[rules.required]" required></v-text-field>
            <v-text-field v-model="form.password" label="Password" type="password" :rules="[rules.required]"
                required></v-text-field>
            <v-btn type="submit" color="primary" block :disabled="!formValid" class="mt-4">
                Sigin
            </v-btn>
        </v-form>
        <v-alert v-if="error" type="error" class="mt-4" dismissible @input="error = ''">
            {{ error }}
        </v-alert>
        <p class="text-center mt-4">
            Do have an account?
            <router-link to="/admin/login">Login</router-link>
        </p>
    </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../plugins/axios';

interface LoginForm {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
}

const router = useRouter();
const form = ref<LoginForm>({
    first_name: "",
    last_name: "",
    email: "",
    username: '',
    password: ''
});
const error = ref<string>('');
const formValid = ref<boolean>(false);

const rules = {
    required: (value: string) => !!value || 'This field is required',
};

const Sigin = async () => {
    try {
        error.value = '';
        const response = await axios.post('/api/users/create', form.value);
        console.log("The sigin", response)
        router.push('/admin/dashboard');
    } catch (err: any) {
        error.value = err.response?.data || 'Login failed. Please check your credentials.';
    }
};
</script>

<style lang="scss" scoped></style>