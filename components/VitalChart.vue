<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend)

const props = defineProps({
  data: Object,
  options: Object,
  type: {
    type: String,
    default: 'line'
  },
  color: {
    type: String,
    default: '#2563eb'
  }
})

const chartCanvas = ref(null)
let chart = null

onMounted(() => {
  if (chartCanvas.value) {
    chart = new ChartJS(chartCanvas.value, {
      type: props.type,
      data: props.data,
      options: {
        ...props.options,
        plugins: {
          ...props.options.plugins,
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: props.color,
            borderWidth: 1
          }
        }
      }
    })
  }
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})

watch(() => props.data, (newData) => {
  if (chart) {
    chart.data = newData
    chart.update()
  }
}, { deep: true })
</script>