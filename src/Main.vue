<!-- src/Main.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
// import App from './App.vue';
// import AuthLayout from './layouts/AuthLayout.vue';
import App from './App.vue';
import AuthLayout from './layouts/AuthLayout.vue';

const route = useRoute();
const layout = computed(() => {
    return route.meta.layout === 'auth' ? AuthLayout : App;
});
</script>

<template>
    <component :is="layout">
        <router-view />
    </component>
</template>