<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Device Management</h2>
          <p class="mt-1 text-sm text-gray-500">Connect and manage wearable devices for real-time patient monitoring</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button 
            @click="connectWebSocket"
            :disabled="isConnected"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Icon name="heroicons:wifi" class="w-4 h-4 mr-2" />
            {{ isConnected ? 'Connected' : 'Connect to Server' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Real-time Status Banner -->
    <div class="mb-6 p-4 rounded-lg" :class="statusBannerClass">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Icon :name="statusIcon" class="w-5 h-5 mr-3" />
          <div>
            <p class="font-medium">{{ statusTitle }}</p>
            <p class="text-sm opacity-90">{{ statusDescription }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm font-medium">{{ connectedDevices.length }} devices connected</p>
          <p class="text-xs opacity-75">{{ patients.length }} patients monitored</p>
        </div>
      </div>
    </div>

    <!-- Device Manager -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Device Management -->
      <div class="lg:col-span-2">
        <DeviceManager :patients="patients" />
      </div>
      
      <!-- Sidebar with Stats and Info -->
      <div class="space-y-6">
        <!-- Connection Stats -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Connection Statistics</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total Devices</span>
              <span class="text-lg font-semibold text-gray-900">{{ devices.length }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Connected</span>
              <span class="text-lg font-semibold text-green-600">{{ connectedDevices.length }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Data Points/min</span>
              <span class="text-lg font-semibold text-blue-600">{{ dataPointsPerMinute }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Uptime</span>
              <span class="text-lg font-semibold text-gray-900">{{ uptime }}</span>
            </div>
          </div>
        </div>

        <!-- Device Types Info -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Supported Devices</h3>
          <div class="space-y-3">
            <div v-for="(info, type) in deviceTypes" :key="type" class="flex items-center space-x-3">
              <Icon :name="info.icon" class="w-6 h-6 text-gray-600" />
              <div>
                <p class="font-medium text-gray-900">{{ info.name }}</p>
                <p class="text-xs text-gray-500">{{ info.capabilities.length }} sensors</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div class="space-y-3">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
              <Icon :name="activity.icon" :class="['w-4 h-4 mt-0.5', activity.iconColor]" />
              <div>
                <p class="text-sm text-gray-900">{{ activity.message }}</p>
                <p class="text-xs text-gray-500">{{ formatTimeAgo(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDistanceToNow } from 'date-fns'

const { connect, isConnected, connectionStatus } = useWebSocket()
const { devices, connectedDevices, deviceTypes } = useWearableDevices()

// Mock patients data
const patients = ref([
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sarah Johnson' },
  { id: 3, name: 'Michael Davis' }
])

const recentActivity = ref([
  {
    id: 1,
    message: 'Apple Watch connected to John Smith',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    icon: 'heroicons:check-circle',
    iconColor: 'text-green-500'
  },
  {
    id: 2,
    message: 'Heart rate alert triggered for Sarah Johnson',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    icon: 'heroicons:exclamation-triangle',
    iconColor: 'text-yellow-500'
  },
  {
    id: 3,
    message: 'Oura Ring battery low warning',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    icon: 'heroicons:battery-0',
    iconColor: 'text-red-500'
  }
])

const statusBannerClass = computed(() => {
  if (isConnected.value && connectedDevices.value.length > 0) {
    return 'bg-green-50 border border-green-200 text-green-800'
  } else if (isConnected.value) {
    return 'bg-blue-50 border border-blue-200 text-blue-800'
  } else {
    return 'bg-yellow-50 border border-yellow-200 text-yellow-800'
  }
})

const statusIcon = computed(() => {
  if (isConnected.value && connectedDevices.value.length > 0) {
    return 'heroicons:signal'
  } else if (isConnected.value) {
    return 'heroicons:wifi'
  } else {
    return 'heroicons:exclamation-triangle'
  }
})

const statusTitle = computed(() => {
  if (isConnected.value && connectedDevices.value.length > 0) {
    return 'Real-time Monitoring Active'
  } else if (isConnected.value) {
    return 'Server Connected'
  } else {
    return 'Monitoring Offline'
  }
})

const statusDescription = computed(() => {
  if (isConnected.value && connectedDevices.value.length > 0) {
    return 'Receiving live data from wearable devices'
  } else if (isConnected.value) {
    return 'Ready to connect devices for real-time monitoring'
  } else {
    return 'Connect to the monitoring server to enable real-time features'
  }
})

const dataPointsPerMinute = computed(() => {
  return connectedDevices.value.length * 12 // 12 data points per minute per device
})

const uptime = ref('99.9%')

const connectWebSocket = () => {
  connect()
}

const formatTimeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

onMounted(() => {
  // Auto-connect to WebSocket on page load
  connectWebSocket()
})
</script>