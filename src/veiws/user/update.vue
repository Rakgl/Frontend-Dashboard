<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "../../plugins/axios";
import { rules } from "../../composables/ruleofInput";

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
const valid = ref(false);
const loading = ref(false);
const file = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const form = ref<User>({
    id: 0,
    profile: "",
    first_name: "",
    last_name: "",
    email: "",
    employee: "",
    position: "",
    department: "",
    phone: "",
    hire_date: "",
    status: "Active",
});

const password = ref("");
const fileRules = [
    (value: File | null) =>
        !value || value.size < 5000000 || "Image size should be less than 5 MB!",
    (value: File | null) =>
        !value ||
        ["image/jpeg", "image/png"].includes(value.type) ||
        "Only JPEG/PNG allowed!",
];

const numericRule = (value: string) => /^\d+$/.test(value) || "Phone must be numeric";
const dateRule = (value: string) =>
    !value || /^\d{4}-\d{2}-\d{2}$/.test(value) || "Invalid date format (YYYY-MM-DD)";

const statusOptions = ["Active", "Inactive", "On Leave", "Terminated"];

const fetchUser = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            await router.push("/admin/login");
            return;
        }
        const response = await axios.get<User>(`/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        form.value = response.data;
        previewUrl.value = response.data.profile.startsWith("/uploads")
            ? `${axios.defaults.baseURL}${response.data.profile}`
            : response.data.profile;
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || "Failed to fetch user";
    }
};

const updateUser = async () => {
    try {
        loading.value = true;
        errorMessage.value = null;
        const token = localStorage.getItem("token");
        if (!token) {
            await router.push("/admin/login");
            return;
        }

        const formData = new FormData();
        if (file.value) {
            formData.append("profile", file.value);
        }
        const hireDate = form.value.hire_date
            ? new Date(form.value.hire_date).toISOString().split("T")[0]
            : "";
        Object.entries({
            ...form.value,
            hire_date: hireDate,
        }).forEach(([key, value]) => {
            formData.append(key, value);
        });
        if (password.value) {
            formData.append("password", password.value);
        }

        await axios.put("/api/users/update", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        router.push("/admin/users");
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || "Failed to update user";
    } finally {
        loading.value = false;
    }
};

const onFileChange = (selectedFile: File | null) => {
    file.value = selectedFile;
    if (previewUrl.value && file.value) {
        URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = selectedFile
        ? URL.createObjectURL(selectedFile)
        : form.value.profile;
};

onMounted(fetchUser);
</script>

<template>
    <v-container fluid>
        <v-form v-model="valid" @submit.prevent="updateUser" class="update-user-form">
            <h1 class="text-h4 mb-4">Update User</h1>
            <v-alert v-if="errorMessage" type="error" dismissible class="mb-6" @input="errorMessage = null">
                {{ errorMessage }}
            </v-alert>

            <v-row>
                <v-col cols="12" md="6">
                    <v-file-input v-model="file" label="Profile Image" accept="image/jpeg,image/png"
                        prepend-icon="mdi-camera" :rules="fileRules" show-size variant="outlined" class="profile-input"
                        aria-label="Upload new profile image" @update:modelValue="onFileChange"></v-file-input>
                    <v-img v-if="previewUrl" :src="previewUrl" max-height="120" max-width="120"
                        class="profile-preview mt-3" alt="Profile image preview"></v-img>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="form.first_name"
                        :rules="[rules.required, rules.minLength(3), rules.maxLength(50)]" label="First Name"
                        variant="outlined" required aria-label="Enter first name"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="form.last_name"
                        :rules="[rules.required, rules.minLength(3), rules.maxLength(50)]" label="Last Name"
                        variant="outlined" required aria-label="Enter last name"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="form.email" :rules="[rules.required, rules.email, rules.maxLength(50)]"
                        label="Email" variant="outlined" required aria-label="Enter email address"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="form.employee"
                        :rules="[rules.required, rules.minLength(3), rules.maxLength(50)]" label="Employee ID"
                        variant="outlined" required aria-label="Enter employee ID"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="form.position"
                        :rules="[rules.required, rules.minLength(3), rules.maxLength(50)]" label="Position"
                        variant="outlined" required aria-label="Enter position"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="form.department"
                        :rules="[rules.required, rules.minLength(3), rules.maxLength(50)]" label="Department"
                        variant="outlined" required aria-label="Enter department"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="form.phone" :rules="[
                        rules.required,
                        rules.minLength(3),
                        rules.maxLength(20),
                        numericRule,
                    ]" label="Phone" variant="outlined" required aria-label="Enter phone number"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="form.hire_date" :rules="[rules.required, dateRule]" label="Hire Date"
                        type="date" variant="outlined" required aria-label="Select hire date"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-select v-model="form.status" :items="statusOptions" :rules="[rules.required]" label="Status"
                        variant="outlined" required aria-label="Select status"></v-select>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="password" :rules="[rules.minLength(8), rules.maxLength(128)]"
                        label="Password (optional)" type="password" variant="outlined"
                        aria-label="Enter new password (optional)"></v-text-field>
                </v-col>
            </v-row>

            <div class="text-center mt-6">
                <v-btn append-icon="mdi-account-circle" prepend-icon="mdi-check-circle" color="primary"
                    :loading="loading" :disabled="loading || !valid" type="submit" class="update-btn"
                    aria-label="Update user">
                    <template v-slot:prepend>
                        <v-icon color="success"></v-icon>
                    </template>
                    Update
                    <template v-slot:append>
                        <v-icon color="warning"></v-icon>
                    </template>
                </v-btn>
            </div>
        </v-form>
    </v-container>
</template>

<style lang="scss" scoped>
.update-user-form {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.v-col {
    padding: 12px;
}

.profile-input {
    :deep(.v-input__control) {
        border-radius: 6px;
    }
}

.profile-preview {
    border-radius: 50%;
    border: 2px solid #e0e0e0;
    object-fit: cover;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.05);
    }
}

.update-btn {
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

.v-alert {
    border-radius: 6px;
}

@media (max-width: 600px) {
    .update-user-form {
        padding: 16px;
    }

    .v-col {
        padding: 8px;
    }

    .update-btn {
        width: 100%;
    }
}
</style>
