<!-- src/views/Dashboard.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from '../plugins/axios';

interface Stat {
    users: number;
    active: number;
}

const stats = ref<Stat>({ users: 0, active: 0 });

onMounted(async () => {
    try {
        const response = await axios.get('/api/dashboard-stats');
        stats.value = response.data;
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
    }
});
</script>

<template>
    <v-container>
        <h1 class="text-h4 mb-4">Dashboard</h1>
        <v-row>
            <v-col cols="12" sm="6">
                <v-card>
                    <v-card-title>Total Users</v-card-title>
                    <v-card-text>{{ stats.users }}</v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6">
                <v-card>
                    <v-card-title>Active Users</v-card-title>
                    <v-card-text>{{ stats.active }}</v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>