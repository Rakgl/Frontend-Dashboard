import { ref, onMounted, onUnmounted } from 'vue';
import { useTheme } from 'vuetify';

export function useThemeManager() {
    const vuetifyTheme = useTheme();
    const theme = ref<'light' | 'dark' | 'system'>('system');
    const isDark = ref(false);
    const isHighContrast = ref(false);
    const isReducedMotion = ref(false);
    const isOnBattery = ref(false);

    const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
        try {
            if (newTheme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
                vuetifyTheme.global.name.value = prefersDark ? 'dark' : 'light';
                isDark.value = prefersDark;
                isHighContrast.value = prefersHighContrast;
                localStorage.removeItem('theme');
            } else {
                vuetifyTheme.global.name.value = newTheme;
                isDark.value = newTheme === 'dark';
                isHighContrast.value = false; // Reset for manual theme
                localStorage.setItem('theme', newTheme);
            }
            theme.value = newTheme;

            // Adjust for reduced motion based on system preference
            isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            applyMotionPreferences();

            // Adjust for battery status
            checkBatteryStatus();
        } catch (error) {
            console.error('Failed to apply theme:', error);
            vuetifyTheme.global.name.value = 'light';
            isDark.value = false;
            isHighContrast.value = false;
            theme.value = 'light';
        }
    };

    const applyMotionPreferences = () => {
        if (isReducedMotion.value) {
            document.body.style.transition = 'none'; // Disable animations
        } else {
            document.body.style.transition = ''; // Restore default
        }
    };

    const checkBatteryStatus = () => {
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: BatteryManager) => {
                isOnBattery.value = !battery.charging;
                if (isOnBattery.value && battery.level <= 0.2) {
                    // Optimize for low battery (e.g., switch to light theme if dark)
                    if (isDark.value) {
                        vuetifyTheme.global.name.value = 'light';
                        isDark.value = false;
                    }
                }
            });
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
            const prefersContrast = window.matchMedia('(prefers-contrast: more)');
            const prefersMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

            const handleSystemThemeChange = (e: MediaQueryListEvent) => {
                if (theme.value === 'system') {
                    vuetifyTheme.global.name.value = e.matches ? 'dark' : 'light';
                    isDark.value = e.matches;
                }
            };

            const handleContrastChange = (e: MediaQueryListEvent) => {
                isHighContrast.value = e.matches;
                // Optionally apply a high-contrast theme variant if supported by Vuetify
                if (e.matches) {
                    vuetifyTheme.global.name.value += '-high-contrast'; // Custom theme needed
                }
            };

            const handleMotionChange = (e: MediaQueryListEvent) => {
                isReducedMotion.value = e.matches;
                applyMotionPreferences();
            };

            prefersDark.addEventListener('change', handleSystemThemeChange);
            prefersContrast.addEventListener('change', handleContrastChange);
            prefersMotion.addEventListener('change', handleMotionChange);

            onUnmounted(() => {
                prefersDark.removeEventListener('change', handleSystemThemeChange);
                prefersContrast.removeEventListener('change', handleContrastChange);
                prefersMotion.removeEventListener('change', handleMotionChange);
            });

            // Initial checks
            isHighContrast.value = prefersContrast.matches;
            isReducedMotion.value = prefersMotion.matches;
            checkBatteryStatus();
        } catch (error) {
            console.error('Failed to initialize theme:', error);
            applyTheme('light');
        }
    };

    onMounted(() => {
        initTheme();
    });

    return { theme, isDark, isHighContrast, isReducedMotion, isOnBattery, applyTheme };
}