<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "../../plugins/axios";

type Status = "Active" | "Inactive" | "On Leave" | "Terminated";

interface User {
    id: number;
    profile: string;
    first_name: string;
    last_name: string;
    email: string;
    employee: string;
    position: string;
    department: string;
    phone: string;
    hire_date: string;
    status: Status;
}

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const errorMessage = ref<string | null>(null);
const user = ref<User | null>(null);

const fetchUser = async () => {
    try {
        loading.value = true;
        const token = localStorage.getItem("token");
        if (!token) {
            await router.push("/admin/login");
            return;
        }
        const response = await axios.get<User>(`/api/users/${route.params.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        user.value = response.data;
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || "Failed to fetch user";
    } finally {
        loading.value = false;
    }
};

const getStatusColor = (status: Status) => {
    switch (status) {
        case "Active":
            return "success";
        case "Inactive":
            return "error";
        case "On Leave":
            return "warning";
        case "Terminated":
            return "error";
        default:
            return "grey";
    }
};

onMounted(fetchUser);
</script>

<template>
    <v-container fluid>
        <v-card class="view-user-card">
            <v-card-title class="text-h4 text-center">User Details</v-card-title>
            <v-alert v-if="errorMessage" type="error" dismissible class="ma-4" @input="errorMessage = null">
                {{ errorMessage }}
            </v-alert>
            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
            <v-card-text v-if="user">
                <v-row>
                    <v-col cols="12" md="4" class="text-center">
                        <v-img :src="user.profile.startsWith('/uploads')
                                ? `${axios.defaults.baseURL}${user.profile}`
                                : user.profile
                            " max-height="150" max-width="150" class="profile-preview mx-auto" alt="User profile image"></v-img>
                    </v-col>
                    <v-col cols="12" md="8">
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field :value="user.first_name" label="First Name" variant="outlined" readonly
                                    aria-label="First name"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field :value="user.last_name" label="Last Name" variant="outlined" readonly
                                    aria-label="Last name"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field :value="user.email" label="Email" variant="outlined" readonly
                                    aria-label="Email address"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field :value="user.employee" label="Employee ID" variant="outlined" readonly
                                    aria-label="Employee ID"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field :value="user.position" label="Position" variant="outlined" readonly
                                    aria-label="Position"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field :value="user.department" label="Department" variant="outlined" readonly
                                    aria-label="Department"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field :value="user.phone" label="Phone" variant="outlined" readonly
                                    aria-label="Phone number"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field :value="user.hire_date" label="Hire Date" variant="outlined" readonly
                                    aria-label="Hire date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-chip :color="getStatusColor(user.status)" class="status-chip" size="small"
                                    :aria-label="`Status: ${user.status}`">
                                    {{ user.status }}
                                </v-chip>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="justify-center pa-4">
                <v-btn color="primary" class="back-btn" @click="router.push('/admin/users')"
                    aria-label="Back to employees list">
                    Back
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<style lang="scss" scoped>
.view-user-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 24px;
}

.text-h4 {
    color: #1a237e;
    font-weight: 600;
}

.profile-preview {
    border-radius: 50%;
    border: 2px solid #e0e0e0;
    object-fit: cover;
}

.v-text-field {
    :deep(.v-field) {
        border-radius: 6px;
    }

    :deep(.v-label) {
        color: #424242;
        font-weight: 500;
    }
}

.status-chip {
    font-weight: 500;
    text-transform: capitalize;
    min-width: 80px;
    justify-content: center;

    &.success {
        background-color: #4caf50 !important;
        color: white;
    }

    &.error {
        background-color: #f44336 !important;
        color: white;
    }

    &.warning {
        background-color: #ff9800 !important;
        color: white;
    }
}

.back-btn {
    min-width: 160px;
    padding: 12px 24px;
    border-radius: 6px;
    text-transform: none;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #303f9f;
    }
}

.v-col {
    padding: 12px;
}

@media (max-width: 600px) {
    .view-user-card {
        padding: 16px;
    }

    .v-col {
        padding: 8px;
    }

    .back-btn {
        width: 100%;
    }
}
</style>
