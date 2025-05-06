<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTheme } from 'vuetify';

const router = useRouter();
const route = useRoute();
const theme = useTheme();
const drawer = ref(true);
const isFullScreen = ref(false);

// Full screen function
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
        console.error('Failed to toggle full-screen:', error);
    }
}

// Dark mode toggle and system preference
const toggleTheme = () => {
    const newTheme = theme.global.name.value === 'light' ? 'dark' : 'light';
    theme.global.name.value = newTheme;
    localStorage.setItem('theme', newTheme);
};

// Sync with system preference
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        theme.global.name.value = savedTheme;
    } else {
        theme.global.name.value = prefersDark.matches ? 'dark' : 'light';
    }

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) {
            theme.global.name.value = e.matches ? 'dark' : 'light';
        }
    };

    prefersDark.addEventListener('change', handleSystemThemeChange);

    // Cleanup listener on unmount
    onUnmounted(() => {
        prefersDark.removeEventListener('change', handleSystemThemeChange);
    });
};

// Load drawer state
const initDrawer = () => {
    const savedDrawerState = localStorage.getItem('drawerState');
    if (savedDrawerState) {
        drawer.value = savedDrawerState === 'true';
    }
};
// Logout
const logout = () => {
    try {
        localStorage.removeItem('token');
        if (document.fullscreenElement) {
            document.exitFullscreen();
            isFullScreen.value = false;
        }
    } catch (error) {
        console.error('Failed to clear localStorage or exit full-screen:', error);
    }
    router.push('/admin/login');
};

// Navigation helper functions
interface MenuItem {
    title: string;
    icon: string;
    action: () => void;
    path: string;
}

const menuItems = ref<MenuItem[]>([
    {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        action: () => router.push('/admin/dashboard'),
        path: '/admin/dashboard',
    },
    {
        title: 'Users',
        icon: 'mdi-account-group',
        action: () => router.push('/admin/users'),
        path: '/admin/users',
    },
    {
        title: 'Settings',
        icon: 'mdi-cog',
        action: () => router.push('/admin/settings'),
        path: '/admin/settings',
    },
]);

// Initialize
onMounted(() => {
    initTheme();
    initDrawer();
});
</script>

<template>
    <v-app>
        <!-- Sidebar -->
        <div class="container-left">
            <v-navigation-drawer class="side-left" v-model="drawer" app clipped>
                <v-list>
                    <a href="/admin/dashboard">
                        <v-toolbar-title><img src="/src//assets//img/image.png" alt=""></v-toolbar-title>
                    </a>
                    <v-list-item v-for="item in menuItems" :key="item.title" :prepend-icon="item.icon"
                        :title="item.title" @click="item.action" style="color: white"
                        :active="route.path === item.path">
                    </v-list-item>
                </v-list>
                <template #append>
                    <v-list-item prepend-icon="mdi-logout" title="Logout" @click="logout"
                        style="color: white"></v-list-item>
                </template>
            </v-navigation-drawer>
        </div>

        <!-- App Bar -->
        <v-app-bar app>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <i class="fa-solid fa-magnifying-glass"></i>
            <v-spacer></v-spacer>
            <v-btn icon class="ml-1" @click="toggleFullScreen">
                <v-icon>{{ isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
            </v-btn>
            <v-btn icon @click="toggleTheme" class="theme-toggle-btn primary" text="Toggle Theme">
                <v-icon>{{ theme.global.name.value === 'dark' ? 'mdi-white-balance-sunny' : 'mdi-moon-waxing-crescent'
                    }}</v-icon>
            </v-btn>
            <v-btn icon class="ml-1">
                <v-icon>mdi-bell</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <v-container fluid>
                <RouterView />
            </v-container>
        </v-main>
    </v-app>
</template>

<style lang="scss" scoped>
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

/* Smooth transitions for theme changes */
.v-app,
.sidebar,
.v-main,
.v-data-table {
    transition: background-color 0.3s ease, color 0.3s ease;
}

/* Button animation */
.theme-toggle-btn {
    transition: transform 0.2s ease;
}

.theme-toggle-btn:hover {
    transform: scale(1.2);
}

.theme-toggle-btn:active {
    transform: rotate(180deg);
}

/* Ensure sidebar background syncs with theme */
.sidebar {
    background-color: v-bind("theme.global.name.value === 'dark' ? '#333' : '#fff'");
}

.container-left {
    width: 200px;

    .side-left {
        background-color: #405288;
        width: 200px;
    }
}


.v-data-table {
    transition: background-color 0.3s ease;
}
</style>