<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../plugins/axios';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
}

const router = useRouter();
const users = ref<User[]>([]);
const error = ref('');
const loading = ref(false);

const headers = [
    { title: 'ID', key: 'id' },
    { title: 'First Name', key: 'first_name' },
    { title: 'Last Name', key: 'last_name' },
    { title: 'Email', key: 'email' },
    { title: 'Username', key: 'username' },
];
// Fetch users
const fetchUsers = async () => {
    loading.value = true;
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        const response = await axios.get<User[]>('/api/users', {
            headers: { Authorization: `Bearer ${token}` },
        });
        users.value = response.data;
    } catch (err: any) {
        error.value = err.response?.data || 'Failed to fetch users';
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            router.push('/admin/login');
        }
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchUsers();
});
</script>

<template>
    <v-container>
        <v-row>
            <v-col>
                <h1 class="text-h4 mb-4">Users</h1>
                <v-alert v-if="error" type="error" dismissible @input="error = ''">
                    {{ error }}
                </v-alert>
                <v-data-table :headers="headers" :items="users" :loading="loading" class="elevation-1">
                    <template #no-data>
                        <v-alert type="info">No users found</v-alert>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<style lang="sass" scoped>

</style>