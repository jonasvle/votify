<script setup lang="ts">
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip
);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    default() {
      return {
        responsive: false,
        maintainAspectRatio: false,
        legend: { display: false },
        options: {
          indexAxis: "y",
        },
      };
    },
  },
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 400,
  },
});

const chartData = computed(() => ({
  labels: props.data.labels,
  datasets: [
    {
      label: "Votes",
      borderColor: "#5eead4",
      borderWidth: 2,
      backgroundColor: "#0f766e",
      hoverBackgroundColor: "#14b8a6",
      data: props.data.data,
    },
  ],
}));
</script>

<template>
  <Bar
    v-if="chartData?.labels.length > 0"
    :chart-data="chartData"
    :chart-options="options"
    :width="width"
    :height="height"
  />
</template>
