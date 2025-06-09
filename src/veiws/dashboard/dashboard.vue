<script lang="ts" setup>

</script>

<template>
    <v-container fluid>
        <div class="d-flex align-center justify-space-between mb-4">
            <div>
                <h1 class="text-h4 mb-4">Dashboard</h1>
            </div>
            <div class="btn-check">
                <v-btn class="mr-2" color="warning">Punch Out</v-btn>
                <v-btn class="mr-2" color="success">Punch In</v-btn>
                <v-btn class="mr-2" color="primary">Take Break</v-btn>
                <v-btn color="primary">On Lunch Break</v-btn>
            </div>
        </div>
        <v-row>
            <v-col cols="12" md="7">
                <v-card class="mb-4" elevation="2" height="190px">
                    <v-card-title>Good Morning, Kosal linnorak</v-card-title>
                    <v-card-text>
                        Display key metrics or overview here
                    </v-card-text>
                </v-card>

                <v-row>
                    <v-col cols="12" md="6">
                        <v-card elevation="2">
                            <v-card-title>Metric 1</v-card-title>
                            <v-card-text>
                                First metric details
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-card elevation="2">
                            <v-card-title>Metric 2</v-card-title>
                            <v-card-text>
                                Second metric details
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-card elevation="2">
                            <v-card-title>Metric 1</v-card-title>
                            <v-card-text>
                                First metric details
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-card elevation="2">
                            <v-card-title>Metric 2</v-card-title>
                            <v-card-text>
                                Second metric details
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" md="5">
                <v-card class="sidebar-card" elevation="2">
                    <v-card-title>Time Log</v-card-title>
                    <v-card-text>
                        Additional information or charts
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style lang="scss" scoped>
:deep(.v-card) {
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


:deep(.sidebar-card) {
    height: 400px;
}


:deep(.v-col) {
    padding: 12px;
}
</style>