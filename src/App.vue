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

const toggleTheme = () => {
    const newTheme = theme.global.name.value === 'light' ? 'dark' : 'light';
    theme.global.name.value = newTheme;
    localStorage.setItem('theme', newTheme);
};

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

        <v-app-bar app>
            <svg @click="drawer = !drawer" viewBox="0 0 100 100">
                <path fill="none" stroke="#fff" stroke-width="10" d="M 20 20 C 24 20 36 20 50 20 C 64 20 76 20 80 20">
                    <animate attributeName="d"
                        values="M 20 20 C 24 20 36 20 50 20 C 64 20 76 20 80 20; M 20 20 C 37 37 37 37 50 50 C 63 37 63 37 80 20"
                        dur=".5s" begin="menuBtn.click" repeatCount="0" fill="freeze" />
                    <animate attributeName="d"
                        values="M 20 20 C 37 37 37 37 50 50 C 63 37 63 37 80 20; M 20 20 C 24 20 36 20 50 20 C 64 20 76 20 80 20"
                        dur=".5s" repeatCount="none" begin="backToMenu.click" fill="freeze" />
                </path>
                <path stroke="#fff" stroke-width="10" d="M20 50h30h30">
                    <animate attributeName="d" values="M 20 50 h 30 h 30; M 50 50 h 0 h 0" dur=".5s"
                        begin="menuBtn.click" repeatCount="0" fill="freeze" />
                    <animate attributeName="d" values="M 50 50 h 0 h 0; M 20 50 h 30 h 30" dur=".5s" repeatCount="none"
                        begin="backToMenu.click" fill="freeze" />
                </path>
                <path fill="none" stroke="#fff" stroke-width="10" d="M 20 80 C 24 80 36 80 50 80 C 64 80 76 80 80 80">
                    <animate attributeName="d"
                        values="M 20 80 C 24 80 36 80 50 80 C 64 80 76 80 80 80; M 20 80 C 37 63 37 63 50 50 C 63 63 63 63 80 80"
                        dur=".5s" begin="menuBtn.click" repeatCount="0" fill="freeze" />
                    <animate attributeName="d"
                        values="M 20 80 C 37 63 37 63 50 50 C 63 63 63 63 80 80; M 20 80 C 24 80 36 80 50 80 C 64 80 76 80 80 80"
                        dur=".5s" repeatCount="none" begin="backToMenu.click" fill="freeze" />
                </path>

                <path id="backToMenu" d="M 0 0 h100v100h-100z" fill="rgba(0,0,0,0)" stroke="none">
                    <animate attributeName="d" values="M 0 0 h0v0h0z; M 0 0 h100v100h-100z" dur="1ms" repeatCount="none"
                        begin="menuBtn.click" fill="freeze" />
                    <animate attributeName="d" values="M 0 0 h100v100h-100z; M 0 0 h0v0h0z" dur="1ms" repeatCount="none"
                        begin="backToMenu.click" fill="freeze" />
                </path>

                <path id="menuBtn" d="M 50 0 A 1 1 0 0 0 50 100 A 1 1 0 0 0 50 0" fill="rgba(0,0,0,0)">
                    <animate attributeName="d" values="M 0 0 h100v100h-100z; M 0 0 h0v0h0z" dur="1ms" repeatCount="none"
                        begin="menuBtn.click" fill="freeze" />
                    <animate attributeName="d" values="M 0 0 h0v0h0z; M 0 0 h100v100h-100z" dur="1ms" repeatCount="none"
                        begin="backToMenu.click" fill="freeze" />
                </path>
            </svg>
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
svg {
    position: absolute;
    top: 50%;
    left: 3%;
    transform: translate(-50%, -50%);
    border: 4px solid rgba(255, 255, 255, 0.5);
    height: 100px;
    cursor: pointer;
    width: 35px;
    height: 35px;
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
        background-color: #405288;
        width: 200px;
    }
}

.v-data-table {
    transition: background-color 0.3s ease;
}
</style>