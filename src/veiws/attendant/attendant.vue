<script setup lang="ts">
import { useTheme } from "vuetify";
import { ref, computed, onMounted } from "vue";
import axios from "../../plugins/axios";

const theme = useTheme();

interface KhmerLunarDate {
  solarDate: Date;
  lunarDate: string;
  note: string;
  holiday: boolean;
  buddhistDay: boolean;
  shavedDay: boolean;
  monthTransition: boolean;
  isCurrent?: boolean;
}

interface CalendarData {
  prevMonth: string;
  nextMonth: string;
  skipper: number;
  lastDay: number;
  numRows: number;
  lLunarDate: string;
  khmerLunarDates: KhmerLunarDate[];
}

const calendarData = ref<CalendarData | null>(null);
const error = ref<string | null>(null);
const loading = ref(true);

const currentDate = new Date();

const fetchCalendarData = async (dm: number = 0) => {
  try {
    loading.value = true;
    const response = await axios.get(`/KhmerLunar?dm=${dm}`);
    calendarData.value = {
      ...response.data,
      khmerLunarDates: response.data.khmerLunarDates.map((day: any) => ({
        ...day,
        solarDate: new Date(day.solarDate),
      })),
    };
  } catch (err: any) {
    error.value = `Failed to load calendar data: ${err.message || "Unknown error"}`;
    console.error("Error fetching calendar data:", err);
  } finally {
    loading.value = false;
  }
};

const days = computed(() => {
  if (!calendarData.value) return [];
  return calendarData.value.khmerLunarDates.map((day: KhmerLunarDate) => ({
    ...day,
    isCurrent: day.solarDate.toDateString() === currentDate.toDateString(),
  }));
});

const calendarGrid = computed(() => {
  if (!calendarData.value) return [];
  const grid = [];
  let dayIndex = 0;
  const startOffset = calendarData.value.skipper;
  const totalDays = calendarData.value.lastDay;
  const numRows = Math.ceil((totalDays + startOffset) / 7);

  for (let row = 0; row < numRows; row++) {
    const week = [];
    for (let col = 0; col < 7; col++) {
      if (row === 0 && col < startOffset) {
        week.push(null);
      } else if (dayIndex < totalDays) {
        week.push(days.value[dayIndex]);
        dayIndex++;
      } else {
        week.push(null);
      }
    }
    grid.push(week);
  }
  return grid;
});

const monthYear = computed(() => {
  if (!calendarData.value || !calendarData.value.khmerLunarDates[0]) return "";
  const firstDay = calendarData.value.khmerLunarDates[0].solarDate;
  return firstDay.toLocaleString("en-US", { month: "long", year: "numeric" });
});

const weekdays = ["អាទិត្យ", "ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរិ៍"];

onMounted(() => {
  fetchCalendarData(0);
});
</script>

<template>
  <v-container fluid>
    <h1 class="text-h4 mb-4">Attendace</h1>
    <v-card>
      <div :class="['chart-card', { 'dark-mode': theme.global.name.value === 'dark' }]">
        <div v-if="loading" class="text-center">
          <v-progress-circular indeterminate color="primary" />
          <span class="ml-2">Loading calendar...</span>
        </div>
        <div v-else-if="error">
          <v-alert type="error">{{ error }}</v-alert>
        </div>
        <div v-else-if="calendarData">
          <h2 class="py-1">{{ monthYear }} / {{ calendarData.prevMonth }}</h2>
          <p class="py-5" v-html="calendarData.lLunarDate"></p>
          <table class="calendar-table">
            <thead>
              <tr>
                <th v-for="day in weekdays" :key="day" class="text-center bg-success">
                  <strong>{{ day }}</strong>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, rowIndex) in calendarGrid" :key="rowIndex">
                <td v-for="(day, colIndex) in week" :key="`${rowIndex}-${colIndex}`" class="text-center pa-2"
                  :class="{ 'current-day': day?.isCurrent, holiday: day?.holiday }">
                  <div v-if="day">
                    <div>{{ day.solarDate.getDate() }}</div>
                    <div class="lunar-date">{{ day.lunarDate }}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
.calendar-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 30px;
}

.calendar-table th,
.calendar-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.chart-card {
  border-radius: 8px;
  border: 1px solid black;
  padding: 16px;
}

.chart-card.dark-mode {
  border-color: white;
  background-color: #1e1e1e;
  color: white;
}

.current-day {
  background-color: #1976d2;
  color: white;
  border-radius: 4px;
}

.holiday {
  background-color: #ff5252;
  color: white;
  border-radius: 4px;
}

.lunar-date {
  font-size: 0.8em;
  color: inherit;
}
</style>
