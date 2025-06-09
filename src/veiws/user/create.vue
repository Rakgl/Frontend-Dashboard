<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "../../plugins/axios";
import { rules } from "../../composables/ruleofInput";

const router = useRouter();
const valid = ref(false);
const loading = ref(false);
const file = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

const form = ref({
  first_name: "",
  last_name: "",
  email: "",
  employee: "",
  position: "",
  department: "",
  phone: "",
  hire_date: "",
  status: "Active",
  password: "",
});

const fileRules = [
  (value: File | null) =>
    !value || value.size < 5000000 || "Image size should be less than 5 MB!",
  (value: File | null) =>
    !value ||
    ["image/jpeg", "image/png"].includes(value.type) ||
    "Only JPEG/PNG allowed!",
];

const numericRule = (value: string) => /^\d+$/.test(value) || "Phone must be numeric";

const statusOptions = ["Active", "Inactive", "On Leave", "Terminated"];

const createUser = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");
    if (!token) {
      await router.push("/admin/login");
      return;
    }

    const formData = new FormData();
    if (file.value) {
      formData.append("profile", file.value);
    }
    Object.entries(form.value).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await axios.post("/api/users/create", form.value, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    form.value = {
      first_name: "",
      last_name: "",
      email: "",
      employee: "",
      position: "",
      department: "",
      phone: "",
      hire_date: "",
      status: "",
      password: "",
    };
    file.value = null;
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
      previewUrl.value = null;
    }

    if (response) {
      router.push("/admin/users");
    } else {
      alert("Hello world it wrong bro ");
    }
  } catch (error: any) {
    // console.error(error);
  } finally {
    loading.value = false;
  }
};

const onFileChange = (selectedFile: File | null) => {
  file.value = selectedFile;
};
</script>

<template>
  <v-container fluid>
    <v-form v-model="valid" @submit.prevent="createUser">
      <div width="100%">
        <h4 class="text-h4 mb-4">Create User</h4>
        <v-row>
          <v-col cols="12" md="6">
            <v-file-input
              v-model="file"
              label="Profile Image"
              accept="image/*"
              prepend-icon="mdi-camera"
              :rules="fileRules"
              show-size
              @update:modelValue="(files) => onFileChange(files as File | null)"
              variant="outlined"
            ></v-file-input>
            <v-img
              v-if="previewUrl"
              :src="previewUrl"
              max-height="100"
              max-width="100"
              class="mt-2"
            ></v-img>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.first_name"
              :rules="[rules.required, rules.minLength(3), rules.maxLength(50)]"
              label="First name"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.last_name"
              :rules="[rules.required, rules.minLength(3), rules.maxLength(50)]"
              label="Last name"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.email"
              :rules="[rules.required, rules.email, rules.maxLength(50)]"
              label="Email"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.employee"
              :rules="[rules.required, rules.minLength(3), rules.maxLength(50)]"
              label="Employee"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.position"
              :rules="[rules.required, rules.minLength(3), rules.maxLength(50)]"
              label="Postion"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.department"
              :rules="[rules.required, rules.minLength(3), rules.maxLength(50)]"
              label="Department"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.phone"
              :rules="[
                rules.required,
                rules.minLength(3),
                rules.maxLength(50),
                numericRule,
              ]"
              label="Phone"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.hire_date"
              :rules="[rules.required, rules.minLength(3), rules.maxLength(50)]"
              label="Hire Date"
              type="date"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="form.status"
              :items="statusOptions"
              :rules="[rules.required]"
              label="Status"
              required
              variant="outlined"
            ></v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.password"
              :rules="[rules.required, rules.minLength(8), rules.maxLength(128)]"
              label="Password"
              type="password"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div class="text-center">
        <v-btn
          append-icon="mdi-account-circle"
          prepend-icon="mdi-check-circle"
          color="primary"
          :loading="loading"
          :disabled="loading || !valid"
          type="submit"
        >
          <template v-slot:prepend>
            <v-icon color="success"></v-icon>
          </template>
          Create
          <template v-slot:append>
            <v-icon color="warning"></v-icon>
          </template>
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<style lang="scss" scoped>
:deep(.v-col) {
  padding: 20px;
}
</style>
