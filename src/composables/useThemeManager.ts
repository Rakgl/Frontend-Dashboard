import { ref, onMounted, onUnmounted } from 'vue';
import { useTheme } from 'vuetify';

export function useThemeManager() {
    const vuetifyTheme = useTheme();
    const theme = ref<'light' | 'dark' | 'system'>('system');
    const isDark = ref(false);

    const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
        try {
            if (newTheme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                vuetifyTheme.global.name.value = prefersDark ? 'dark' : 'light';
                isDark.value = prefersDark;
                localStorage.removeItem('theme');
            } else {
                vuetifyTheme.global.name.value = newTheme;
                isDark.value = newTheme === 'dark';
                localStorage.setItem('theme', newTheme);
            }
            theme.value = newTheme;
        } catch (error) {
            console.error('Failed to apply theme:', error);
            vuetifyTheme.global.name.value = 'light';
            isDark.value = false;
            theme.value = 'light';
        }
    };

    const initTheme = () => {
        try {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
                applyTheme(savedTheme as 'light' | 'dark');
            } else {
                applyTheme('system');
            }

            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            const handleSystemThemeChange = (e: MediaQueryListEvent) => {
                if (theme.value === 'system') {
                    vuetifyTheme.global.name.value = e.matches ? 'dark' : 'light';
                    isDark.value = e.matches;
                }
            };

            prefersDark.addEventListener('change', handleSystemThemeChange);
            onUnmounted(() => {
                prefersDark.removeEventListener('change', handleSystemThemeChange);
            });
        } catch (error) {
            console.error('Failed to initialize theme:', error);
            applyTheme('light');
        }
    };

    onMounted(() => {
        initTheme();
    });

    return { theme, isDark, applyTheme };
}