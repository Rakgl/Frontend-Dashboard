<script setup lang="ts">
import { RouterView } from "vue-router";
import { useTheme } from "vuetify";
import { onMounted, onUnmounted } from "vue";

const theme = useTheme();

const initTheme = () => {
  try {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    if (savedTheme && ["light", "dark"].includes(savedTheme)) {
      theme.global.name.value = savedTheme;
    } else {
      theme.global.name.value = prefersDark.matches ? "dark" : "light";
      localStorage.removeItem("theme");
    }

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        theme.global.name.value = e.matches ? "dark" : "light";
      }
    };

    prefersDark.addEventListener("change", handleSystemThemeChange);

    onUnmounted(() => {
      prefersDark.removeEventListener("change", handleSystemThemeChange);
    });
  } catch (error) {
    console.error("Failed to initialize theme:", error);
    theme.global.name.value = "light";
  }
};

onMounted(() => {
  initTheme();
});
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <RouterView />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
