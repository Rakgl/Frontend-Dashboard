<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
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
const users = ref<User[]>([]);
const error = ref("");
const loading = ref(false);
const searchQuery = ref("");
const filterId = ref("");
const filterEmployee = ref("");
const snackbar = ref({ show: false, message: "", color: "" });

const headers = [
  { title: "ID", key: "id", sortable: true },
  { title: "Employee", key: "employee", sortable: true },
  { title: "Position", key: "position", sortable: true },
  { title: "Department", key: "department", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Action", key: "action" },
];

// Fetch users
const fetchUsers = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    const response = await axios.get<User[]>("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    users.value = response.data;
  } catch (err: any) {
    error.value = err.response?.data?.message || "Failed to fetch users";
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      router.push("/admin/login");
    }
  } finally {
    loading.value = false;
  }
};

// Filter the user
const filteredUsers = computed(() => {
  let result = users.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (user) =>
        user.id.toString().includes(query) ||
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.employee.toLowerCase().includes(query)
    );
  }

  if (filterId.value) {
    result = result.filter((user) => user.id.toString().includes(filterId.value));
  }

  if (filterEmployee.value) {
    result = result.filter((user) =>
      user.employee.toLowerCase().includes(filterEmployee.value.toLowerCase())
    );
  }

  return result;
});

// Clear filters
const clearFilters = () => {
  searchQuery.value = "";
  filterId.value = "";
  filterEmployee.value = "";
};

// Delete user
const deleteUser = async (id: number) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    const response = await axios.delete(`/api/users/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    snackbar.value = {
      show: true,
      message: "User deleted successfully",
      color: "success",
    };
    fetchUsers();
  } catch (err: any) {
    snackbar.value = {
      show: true,
      message: err.response?.data?.message || "Failed to delete user",
      color: "error",
    };
  }
};

const detailUser = (id: number) => {
  router.push(`/detail-user/${id}`);
};

// Edit user
const editUser = (id: number) => {
  router.push(`update-user/${id}`);
};

// Status chip color
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

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <v-container fluid>
    <h4 class="text-h4 mb-4">View Employees</h4>
    <v-alert v-if="error" type="error" dismissible @input="error = ''" class="mb-4">
      {{ error }}
    </v-alert>

    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnifying-glass" label="Search employees"
          variant="outlined" clearable aria-label="Search employees by ID, name, email, or username"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field v-model="filterId" label="Employee ID" variant="outlined" clearable type="number"
          aria-label="Filter by Employee ID"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field v-model="filterEmployee" label="Employee" variant="outlined" clearable
          aria-label="Filter by Username"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-btn class="mt-2" color="secondary" @click="clearFilters" block>Clear Filters</v-btn>
      </v-col>
    </v-row>

    <v-data-table :headers="headers" :items="filteredUsers" :loading="loading" class="elevation-1" :items-per-page="10"
      show-select>
      <template #top>
        <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
      </template>
      <template #no-data>
        <v-alert type="info" class="ma-4">No employees found</v-alert>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" class="status-chip" size="small"
          :aria-label="`Status: ${item.status}`">
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon color="primary" size="large" class="mr-2" @click="detailUser(item.id)" aria-label="View employee">
          mdi-eye
        </v-icon>
        <v-icon color="primary" size="large" class="mr-2 ml-2" @click="editUser(item.id)" aria-label="Edit employee">
          mdi-pencil
        </v-icon>
        <v-icon color="error" size="large" class="mr-2 ml-2" @click="deleteUser(item.id)" aria-label="Delete employee">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style lang="scss" scoped>
.status-chip {
  font-weight: 500;
  text-transform: capitalize;

  &.success {
    background-color: #4caf50 !important; // Green for Active
    color: white;
  }

  &.error {
    background-color: #f44336 !important; // Red for Inactive/Terminated
    color: white;
  }

  &.warning {
    background-color: #ff9800 !important; // Orange for On Leave
    color: white;
  }
}

.v-data-table {
  :deep(.v-data-table__td) {
    padding: 8px !important;
  }

  :deep(.v-chip) {
    min-width: 80px;
    justify-content: center;
  }
}
</style>
