<template>
  <div class="flex items-center space-x-2">
    <div class="relative">
      <div 
        :class="[
          'w-3 h-3 rounded-full',
          isRealTime ? 'bg-green-500' : 'bg-gray-400'
        ]"
      ></div>
      <div 
        v-if="isRealTime"
        class="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75"
      ></div>
    </div>
    <span :class="['text-sm font-medium', isRealTime ? 'text-green-700' : 'text-gray-500']">
      {{ statusText }}
    </span>
    <div v-if="lastUpdate" class="text-xs text-gray-400">
      Updated {{ formatTimeAgo(lastUpdate) }}
    </div>
  </div>
</template>

<script setup>
import { formatDistanceToNow } from 'date-fns'

const props = defineProps({
  isRealTime: {
    type: Boolean,
    default: false
  },
  lastUpdate: {
    type: [Date, String],
    default: null
  },
  deviceConnected: {
    type: Boolean,
    default: false
  }
})

const statusText = computed(() => {
  if (props.isRealTime && props.deviceConnected) {
    return 'Live from wearable device'
  } else if (props.isRealTime) {
    return 'Real-time monitoring'
  } else {
    return 'Simulated data'
  }
})

const formatTimeAgo = (date) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}
</script>