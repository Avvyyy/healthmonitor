<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-sm font-medium text-gray-900">Device Status</h4>
      <Icon 
        :name="device ? getDeviceInfo(device.type).icon : 'heroicons:device-phone-mobile'" 
        class="w-5 h-5 text-gray-600" 
      />
    </div>
    
    <div v-if="device" class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Device</span>
        <span class="text-sm font-medium text-gray-900">{{ device.name }}</span>
      </div>
      
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Status</span>
        <span 
          :class="[
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            device.isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          ]"
        >
          <span 
            :class="[
              'w-2 h-2 rounded-full mr-1',
              device.isConnected ? 'bg-green-500' : 'bg-gray-400'
            ]"
          ></span>
          {{ device.isConnected ? 'Connected' : 'Disconnected' }}
        </span>
      </div>
      
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Battery</span>
        <div class="flex items-center space-x-2">
          <div class="w-8 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              :class="[
                'h-full rounded-full transition-all duration-300',
                device.batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'
              ]"
              :style="{ width: `${device.batteryLevel}%` }"
            ></div>
          </div>
          <span class="text-sm font-medium text-gray-900">{{ device.batteryLevel }}%</span>
        </div>
      </div>
      
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Last Sync</span>
        <span class="text-sm text-gray-900">{{ formatTime(device.lastSeen) }}</span>
      </div>
      
      <!-- Device Capabilities -->
      <div class="pt-2 border-t border-gray-100">
        <span class="text-sm text-gray-600 block mb-2">Monitoring</span>
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="capability in getDeviceInfo(device.type).capabilities"
            :key="capability"
            class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ formatCapability(capability) }}
          </span>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-4">
      <Icon name="heroicons:signal-slash" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p class="text-sm text-gray-500">No device connected</p>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'

const { getDeviceInfo } = useWearableDevices()

const props = defineProps({
  device: {
    type: Object,
    default: null
  }
})

const formatTime = (date) => {
  return format(new Date(date), 'HH:mm:ss')
}

const formatCapability = (capability) => {
  const capabilities = {
    'heart_rate': 'Heart Rate',
    'steps': 'Steps',
    'calories': 'Calories',
    'sleep': 'Sleep',
    'temperature': 'Temperature',
    'hrv': 'HRV',
    'gps': 'GPS',
    'vo2_max': 'VO2 Max',
    'stress_level': 'Stress'
  }
  return capabilities[capability] || capability
}
</script>