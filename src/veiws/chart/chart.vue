<script setup lang="ts">
import { ref, onMounted, watch, computed, PropType } from "vue";
import { useRouter } from "vue-router";
import axios from "../../plugins/axios";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  created_at?: string;
}

type ChartType = "bar" | "line" | "area" | "pie";
type TimeRange = "6m" | "1y" | "all";

interface ChartData {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

const props = defineProps({
  height: {
    type: String,
    default: "400px",
  },
  defaultChartType: {
    type: String as PropType<ChartType>,
    default: "bar",
  },
  defaultTimeRange: {
    type: String as PropType<TimeRange>,
    default: "6m",
  },
  title: {
    type: String,
    default: "User Registration Trends",
  },
});

const router = useRouter();

const chartType = ref<ChartType>(props.defaultChartType);
const timeRange = ref<TimeRange>(props.defaultTimeRange);
const users = ref<User[]>([]);
const chartData = ref<ChartData>({
  categories: [],
  series: [
    {
      name: "New Users",
      data: [],
    },
  ],
});
const loading = ref(false);
const error = ref("");

const chartOptions = computed<ApexOptions>(() => {
  return {
    chart: {
      type: chartType.value,
      height: 350,
      fontFamily: "Roboto, sans-serif",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    theme: {
      mode: "light",
      palette: "palette1",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: chartType.value === "pie",
      formatter: (val: number) => {
        return val.toString();
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: chartData.value.categories,
      title: {
        text: "Month",
      },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "New Users",
      },
      labels: {
        formatter: (value: number) => {
          return value.toLocaleString();
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value.toLocaleString()} users`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
          },
        },
      },
    ],
    colors: ["#1976D2", "#26A69A", "#FF9800", "#D32F2F", "#7E57C2"],
  };
});

const chartTypeOptions = [
  { title: "Bar", value: "bar" },
  { title: "Line", value: "line" },
  { title: "Area", value: "area" },
  { title: "Pie", value: "pie" },
];

const timeRangeOptions = [
  { title: "6 Months", value: "6m" },
  { title: "1 Year", value: "1y" },
  { title: "All Time", value: "all" },
];

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

    processChartData();
  } catch (err: any) {
    error.value = err.response?.data || "Failed to fetch users";
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      router.push("/admin/login");
    }
  } finally {
    loading.value = false;
  }
};

const processChartData = () => {
  if (!users.value[0]?.created_at) {
    generateMockTimeSeries();
    return;
  }

  const now = new Date();

  let startDate = new Date();
  if (timeRange.value === "6m") {
    startDate.setMonth(now.getMonth() - 6);
  } else if (timeRange.value === "1y") {
    startDate.setFullYear(now.getFullYear() - 1);
  } else {
    const firstUserDate = new Date(
      Math.min(...users.value.map((u) => new Date(u.created_at || new Date()).getTime()))
    );
    startDate = firstUserDate;
  }

  const monthMap = new Map<string, number>();
  const months = [];

  let currentDate = new Date(startDate);
  while (currentDate <= now) {
    const monthKey = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const monthLabel = currentDate.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthMap.set(monthKey, 0);
    months.push({ key: monthKey, label: monthLabel });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  users.value.forEach((user) => {
    if (!user.created_at) return;

    const createdAt = new Date(user.created_at);
    if (createdAt >= startDate && createdAt <= now) {
      const monthKey = `${createdAt.getFullYear()}-${String(
        createdAt.getMonth() + 1
      ).padStart(2, "0")}`;
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
    }
  });

  chartData.value = {
    categories: months.map((m) => m.label),
    series: [
      {
        name: "New Users",
        data: months.map((m) => monthMap.get(m.key) || 0),
      },
    ],
  };
};

const generateMockTimeSeries = () => {
  const months = [];
  const userData = [];
  const now = new Date();
  let startDate = new Date();

  if (timeRange.value === "6m") {
    startDate.setMonth(now.getMonth() - 6);
  } else if (timeRange.value === "1y") {
    startDate.setFullYear(now.getFullYear() - 1);
  } else {
    startDate.setFullYear(now.getFullYear() - 2);
  }

  let currentDate = new Date(startDate);
  while (currentDate <= now) {
    months.push(
      currentDate.toLocaleString("default", { month: "short", year: "numeric" })
    );

    const baseCount = Math.floor(users.value.length / months.length);
    const randomVariation = Math.floor(Math.random() * baseCount * 0.5);
    const monthCount = baseCount + randomVariation;

    userData.push(monthCount);

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  chartData.value = {
    categories: months,
    series: [
      {
        name: "New Users",
        data: userData,
      },
    ],
  };
};

watch(timeRange, () => {
  processChartData();
});

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <v-card>
    <v-card-title>
      <div class="d-flex flex-column flex-sm-row justify-space-between align-center w-100">
        <h1 class="text-h4 mb-2 mb-sm-0">{{ title }}</h1>

        <div class="d-flex flex-column flex-sm-row gap-2">
          <v-select v-model="chartType" :items="chartTypeOptions" item-title="title" item-value="value"
            label="Chart Type" variant="outlined" density="compact" hide-details class="chart-type-select"></v-select>

          <v-btn-group variant="outlined">
            <v-btn v-for="option in timeRangeOptions" :key="option.value" :active="timeRange === option.value"
              @click="timeRange = option.value as TimeRange" density="comfortable" size="small"
              :color="timeRange === option.value ? 'primary' : undefined" class="time-range-btn">
              {{ option.title }}
            </v-btn>
          </v-btn-group>
        </div>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text>
      <v-alert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">
        {{ error }}
      </v-alert>

      <div class="chart-container" :style="{ height: props.height }">
        <v-progress-circular v-if="loading" indeterminate color="primary" size="64"
          class="chart-loader"></v-progress-circular>

        <template v-else>
          <div v-if="chartData.series[0]?.data.length > 0" class="h-100">
            <apexchart :type="chartType" :height="props.height" :options="chartOptions" :series="chartData.series">
            </apexchart>
          </div>

          <v-alert v-else type="info" variant="tonal" icon="mdi-chart-timeline-variant" class="mt-4">
            No data available for the selected time period
          </v-alert>
        </template>
      </div>
    </v-card-text>

    <v-card-text v-if="users.length > 0">
      <div class="d-flex align-center mb-2">
        <v-icon color="primary" class="mr-2">mdi-information</v-icon>
        <span class="text-subtitle-2">Total Users: {{ users.length }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  min-height: 300px;
  width: 100%;
}

.chart-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.chart-type-select {
  min-width: 120px;
  max-width: 150px;
}

.time-range-btn {
  text-transform: none;
}

@media (max-width: 600px) {
  .chart-type-select {
    margin-bottom: 12px;
    width: 100%;
    max-width: none;
  }
}
</style>
