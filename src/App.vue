<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTheme } from "vuetify";
import routes from "../src/routers";

const router = useRouter();
const route = useRoute();
const theme = useTheme();
const drawer = ref(true);
const isFullScreen = ref(false);

const toggleFullScreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      isFullScreen.value = true;
    } else {
      await document.exitFullscreen();
      isFullScreen.value = false;
    }
  } catch (error) {
    console.error("Failed to toggle full-screen:", error);
  }
};

const toggleTheme = () => {
  const newTheme = theme.global.name.value === "light" ? "dark" : "light";
  theme.global.name.value = newTheme;
  localStorage.setItem("theme", newTheme);
};

const resetToSystemTheme = () => {
  localStorage.removeItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  theme.global.name.value = prefersDark.matches ? "dark" : "light";
};

const initTheme = () => {
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
};

// Load drawer state
const initDrawer = () => {
  const savedDrawerState = localStorage.getItem("drawerState");
  if (savedDrawerState) {
    drawer.value = savedDrawerState === "true";
  }
};

// Logout
const logout = () => {
  try {
    localStorage.removeItem("token");
    if (document.fullscreenElement) {
      document.exitFullscreen();
      isFullScreen.value = false;
    }
  } catch (error) {
    console.error("Failed to clear localStorage or exit full-screen:", error);
  }
  router.push("/admin/login");
};

interface MenuItem {
  title: string;
  icon: string;
  action: () => void;
  path: string;
  children?: MenuItem[];
}

const dashboardRoute = router.getRoutes().find((r) => r.name === "admin-dashboard");

const menuItems = ref<MenuItem[]>([
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    action: () => router.push("/dashboard"),
    path: dashboardRoute?.path ?? "/dashboard",
  },
  {
    title: "Attendant",
    icon: "mdi-calendar-star-four-points",
    action: () => router.push("/attendant"),
    path: dashboardRoute?.path ?? "/dashboard",
  },
  {
    title: "Chart",
    icon: "mdi-chart-line-variant",
    action: () => router.push("/chart"),
    path: dashboardRoute?.path ?? "/dashboard",
  },
  {
    title: "Users",
    icon: "mdi-account-group",
    action: () => { },
    path: "/users",
    children: [
      {
        title: "View User",
        icon: "mdi-circle-medium",
        action: () => router.push("/users"),
        path: "/users",
      },
      {
        title: "Create User",
        icon: "mdi-circle-medium",
        action: () => router.push("/create-user"),
        path: "/create",
      },
    ],
  },
]);

const openGroups = ref<string[]>([]);

const toggleGroup = (item: MenuItem) => {
  if (item.children) {
    if (openGroups.value.includes(item.title)) {
      openGroups.value = openGroups.value.filter((t) => t !== item.title);
    } else {
      openGroups.value = [...openGroups.value, item.title];
    }
  } else {
    item.action();
  }
};

// Initialize
onMounted(() => {
  initTheme();
  initDrawer();
});
</script>

<template>
  <v-app>
    <div class="container-left">
      <v-navigation-drawer class="side-left" v-model="drawer" app clipped>
        <v-list>
          <a href="/admin/dashboard">
            <v-toolbar-title><img src="/src//assets//img/image.png" alt="" /></v-toolbar-title>
          </a>
          <v-list-group v-for="item in menuItems" :key="item.title" :value="item.title" :prepend-icon="item.icon"
            :append-icon="item.children ? 'mdi-chevron-down' : 'undefined'" :active="route.path === item.path"
            v-model="openGroups">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="item.title" @click="toggleGroup(item)" :active="route.path === item.path ||
                (item.children && item.children.some((c) => c.path === route.path))
                " style="color: white" />
            </template>
            <v-list-item v-for="child in item.children" :key="child.title" :title="child.title" @click="child.action"
              :prepend-icon="child.icon" style="color: white" :active="route.path === child.path" />
          </v-list-group>
        </v-list>
        <template #append>
          <v-list-item prepend-icon="mdi-logout" title="Logout" @click="logout"
            style="color: white; background: #b10021"></v-list-item>
        </template>
      </v-navigation-drawer>
    </div>

    <v-app-bar app>
      <v-btn icon @click="drawer = !drawer">
        <v-icon>{{ drawer ? "mdi-close" : "mdi-menu" }}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon class="ml-1" @click="toggleFullScreen">
        <v-icon color="primary">{{ isFullScreen ? "mdi-fullscreen-exit" : "mdi-fullscreen" }}</v-icon>
      </v-btn>

      <v-btn icon @click="toggleTheme" class="theme-toggle-btn" color="primary" text="Toggle Theme">
        <v-icon>{{
          theme.global.name.value === "dark"
            ? "mdi-white-balance-sunny"
            : "mdi-moon-waxing-crescent"
        }}</v-icon>
      </v-btn>
      <v-btn icon class="ml-1">
        <v-icon color="primary">mdi-bell</v-icon>
      </v-btn>
      <div class="d-flex align-center mr-5">
        <p class="mr-1">employee</p>
        <v-avatar color="info" size="small">
          64
        </v-avatar>

      </div>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
svg {
  position: absolute;
  top: 50%;
  left: 3%;
  transform: translate(-50%, -50%);
  border: 4px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  width: 35px;
  height: 35px;
  color: none;
}

:deep(.v-list-group__items .v-list-item) {
  padding-inline-start: calc(0px + var(--indent-padding)) !important;
}

:deep(.v-application__wrap) {
  width: 210px;
}

:deep(.v-toolbar-title__placeholder) {
  margin-left: 20px;
  padding: 20px 0;

  img {
    width: 100px;
    text-align: center;
  }
}

.v-app,
.sidebar,
.v-main,
.v-data-table {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.theme-toggle-btn {
  transition: transform 0.2s ease;
}

.theme-toggle-btn:hover {
  transform: scale(1.2);
}

.theme-toggle-btn:active {
  transform: rotate(180deg);
}

.sidebar {
  background-color: v-bind("theme.global.name.value === 'dark' ? '#333' : '#fff'");
}

.container-left {
  width: 200px;

  .side-left {
    background-color: #272a35;
    width: 200px;
  }
}

.v-data-table {
  transition: background-color 0.3s ease;
}
</style>
