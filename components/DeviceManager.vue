<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Wearable Devices</h3>
        <p class="text-sm text-gray-500">Manage patient device connections</p>
      </div>
      <button
        @click="scanForDevices"
        :disabled="isScanning"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
      >
        <Icon 
          :name="isScanning ? 'heroicons:arrow-path' : 'heroicons:magnifying-glass'" 
          :class="['w-4 h-4 mr-2', { 'animate-spin': isScanning }]" 
        />
        {{ isScanning ? 'Scanning...' : 'Scan Devices' }}
      </button>
    </div>

    <!-- Connection Status -->
    <div class="mb-6 p-4 rounded-lg" :class="connectionStatusClass">
      <div class="flex items-center">
        <Icon :name="connectionStatusIcon" class="w-5 h-5 mr-2" />
        <span class="font-medium">{{ connectionStatusText }}</span>
      </div>
    </div>

    <!-- Connected Devices -->
    <div v-if="connectedDevices.length > 0" class="mb-6">
      <h4 class="text-md font-medium text-gray-900 mb-3">Connected Devices</h4>
      <div class="space-y-3">
        <div
          v-for="device in connectedDevices"
          :key="device.id"
          class="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <Icon :name="getDeviceInfo(device.type).icon" class="w-6 h-6 text-green-600" />
            <div>
              <p class="font-medium text-gray-900">{{ device.name }}</p>
              <p class="text-sm text-gray-500">
                Patient: {{ getPatientName(device.patientId) }} • Battery: {{ device.batteryLevel }}%
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Connected
            </span>
            <button
              @click="disconnectDevice(device.id)"
              class="text-red-600 hover:text-red-800"
            >
              <Icon name="heroicons:x-mark" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Devices -->
    <div v-if="availableDevices.length > 0">
      <h4 class="text-md font-medium text-gray-900 mb-3">Available Devices</h4>
      <div class="space-y-3">
        <div
          v-for="device in availableDevices"
          :key="device.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div class="flex items-center space-x-3">
            <Icon :name="getDeviceInfo(device.type).icon" class="w-6 h-6 text-gray-600" />
            <div>
              <p class="font-medium text-gray-900">{{ device.name }}</p>
              <p class="text-sm text-gray-500">
                {{ getDeviceInfo(device.type).name }} • Battery: {{ device.batteryLevel }}%
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <select
              v-model="device.selectedPatient"
              class="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="">Select Patient</option>
              <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                {{ patient.name }}
              </option>
            </select>
            <button
              @click="connectDevice(device.id, device.selectedPatient)"
              :disabled="!device.selectedPatient"
              class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Devices Found -->
    <div v-if="devices.length === 0 && !isScanning" class="text-center py-8">
      <Icon name="heroicons:signal-slash" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500">No devices found. Click "Scan Devices" to search for wearable devices.</p>
    </div>
  </div>
</template>

<script setup>
const { devices, connectedDevices, isScanning, scanForDevices, connectDevice, disconnectDevice, getDeviceInfo } = useWearableDevices()
const { connectionStatus } = useWebSocket()

const props = defineProps({
  patients: {
    type: Array,
    default: () => []
  }
})

const availableDevices = computed(() => {
  return devices.value.filter(device => !device.isConnected)
})

const connectionStatusClass = computed(() => {
  switch (connectionStatus.value) {
    case 'connected':
      return 'bg-green-50 border border-green-200 text-green-800'
    case 'connecting':
    case 'reconnecting':
      return 'bg-yellow-50 border border-yellow-200 text-yellow-800'
    case 'error':
      return 'bg-red-50 border border-red-200 text-red-800'
    default:
      return 'bg-gray-50 border border-gray-200 text-gray-800'
  }
})

const connectionStatusIcon = computed(() => {
  switch (connectionStatus.value) {
    case 'connected':
      return 'heroicons:wifi'
    case 'connecting':
    case 'reconnecting':
      return 'heroicons:arrow-path'
    case 'error':
      return 'heroicons:exclamation-triangle'
    default:
      return 'heroicons:wifi-slash'
  }
})

const connectionStatusText = computed(() => {
  switch (connectionStatus.value) {
    case 'connected':
      return 'WebSocket Connected - Real-time monitoring active'
    case 'connecting':
      return 'Connecting to monitoring server...'
    case 'reconnecting':
      return 'Reconnecting to monitoring server...'
    case 'error':
      return 'Connection error - Check network settings'
    default:
      return 'Disconnected from monitoring server'
  }
})

const getPatientName = (patientId) => {
  const patient = props.patients.find(p => p.id === patientId)
  return patient ? patient.name : 'Unknown'
}
</script>