<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">API Testing Dashboard</h1>
    
    <!-- Connection Status -->
    <div class="mb-6 p-4 rounded-lg" :class="connectionStatusClass">
      <div class="flex items-center">
        <Icon :name="connectionIcon" class="w-5 h-5 mr-3" />
        <div>
          <p class="font-medium">{{ connectionStatus }}</p>
          <p class="text-sm opacity-90">{{ connectionDescription }}</p>
        </div>
      </div>
    </div>

    <!-- Test Buttons -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <button
        @click="testConnection"
        :disabled="isLoading"
        class="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        <Icon name="heroicons:wifi" class="w-5 h-5 mb-2" />
        Test Connection
      </button>
      
      <button
        @click="fetchPatients"
        :disabled="isLoading"
        class="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        <Icon name="heroicons:users" class="w-5 h-5 mb-2" />
        Fetch Patients
      </button>
      
      <button
        @click="fetchDevices"
        :disabled="isLoading"
        class="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        <Icon name="heroicons:device-phone-mobile" class="w-5 h-5 mb-2" />
        Fetch Devices
      </button>
      
      <button
        @click="fetchAlerts"
        :disabled="isLoading"
        class="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
      >
        <Icon name="heroicons:bell" class="w-5 h-5 mb-2" />
        Fetch Alerts
      </button>
      
      <button
        @click="testWebSocket"
        :disabled="isLoading"
        class="p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
      >
        <Icon name="heroicons:bolt" class="w-5 h-5 mb-2" />
        Test WebSocket
      </button>
      
      <button
        @click="createTestVitals"
        :disabled="isLoading"
        class="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        <Icon name="heroicons:heart" class="w-5 h-5 mb-2" />
        Create Test Vitals
      </button>
    </div>

    <!-- Results -->
    <div class="space-y-6">
      <!-- API Response -->
      <div v-if="lastResponse" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Last API Response</h3>
        <div class="bg-gray-50 rounded-lg p-4 overflow-auto">
          <pre class="text-sm text-gray-800">{{ JSON.stringify(lastResponse, null, 2) }}</pre>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="lastError" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-red-800 mb-4">Error</h3>
        <div class="bg-red-100 rounded-lg p-4">
          <pre class="text-sm text-red-700">{{ lastError }}</pre>
        </div>
      </div>

      <!-- WebSocket Messages -->
      <div v-if="wsMessages.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">WebSocket Messages</h3>
        <div class="space-y-2 max-h-64 overflow-auto">
          <div
            v-for="(message, index) in wsMessages"
            :key="index"
            class="bg-gray-50 rounded p-3 text-sm"
          >
            <div class="text-xs text-gray-500 mb-1">{{ message.timestamp }}</div>
            <pre class="text-gray-800">{{ JSON.stringify(message.data, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const { 
  getPatients, 
  getDevices, 
  getAlerts, 
  createVitalSigns,
  apiCall 
} = useApi()

const isLoading = ref(false)
const lastResponse = ref(null)
const lastError = ref(null)
const wsMessages = ref([])
const isConnected = ref(false)

let ws = null

const connectionStatusClass = computed(() => {
  return isConnected.value 
    ? 'bg-green-50 border border-green-200 text-green-800'
    : 'bg-red-50 border border-red-200 text-red-800'
})

const connectionIcon = computed(() => {
  return isConnected.value ? 'heroicons:check-circle' : 'heroicons:x-circle'
})

const connectionStatus = computed(() => {
  return isConnected.value ? 'Backend Connected' : 'Backend Disconnected'
})

const connectionDescription = computed(() => {
  return isConnected.value 
    ? `Connected to ${config.public.apiUrl}`
    : `Failed to connect to ${config.public.apiUrl}`
})

const testConnection = async () => {
  isLoading.value = true
  lastError.value = null
  
  try {
    // Test basic connection to the backend
    const response = await $fetch('/health', {
      baseURL: config.public.apiUrl,
      timeout: 10000
    })
    
    lastResponse.value = response
    isConnected.value = true
  } catch (error) {
    console.error('Connection test failed:', error)
    lastError.value = `Connection failed: ${error.message || 'Unknown error'}`
    isConnected.value = false
    
    // If health endpoint doesn't exist, try the root endpoint
    try {
      const response = await $fetch('/', {
        baseURL: config.public.apiUrl,
        timeout: 10000
      })
      lastResponse.value = { message: 'Backend is running', data: response }
      isConnected.value = true
      lastError.value = null
    } catch (rootError) {
      console.error('Root endpoint test failed:', rootError)
      lastError.value = `Backend unreachable: ${rootError.message || 'Unknown error'}`
    }
  } finally {
    isLoading.value = false
  }
}

const fetchPatients = async () => {
  isLoading.value = true
  lastError.value = null
  
  try {
    const patients = await getPatients()
    lastResponse.value = patients
    isConnected.value = true
  } catch (error) {
    console.error('Fetch patients failed:', error)
    lastError.value = `Failed to fetch patients: ${error.data?.message || error.message}`
    isConnected.value = false
  } finally {
    isLoading.value = false
  }
}

const fetchDevices = async () => {
  isLoading.value = true
  lastError.value = null
  
  try {
    const devices = await getDevices()
    lastResponse.value = devices
    isConnected.value = true
  } catch (error) {
    console.error('Fetch devices failed:', error)
    lastError.value = `Failed to fetch devices: ${error.data?.message || error.message}`
    isConnected.value = false
  } finally {
    isLoading.value = false
  }
}

const fetchAlerts = async () => {
  isLoading.value = true
  lastError.value = null
  
  try {
    const alerts = await getAlerts()
    lastResponse.value = alerts
    isConnected.value = true
  } catch (error) {
    console.error('Fetch alerts failed:', error)
    lastError.value = `Failed to fetch alerts: ${error.data?.message || error.message}`
    isConnected.value = false
  } finally {
    isLoading.value = false
  }
}

const testWebSocket = () => {
  const wsUrl = config.public.websocketUrl
  
  try {
    ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      wsMessages.value.push({
        timestamp: new Date().toISOString(),
        data: { type: 'connection', message: 'WebSocket connected' }
      })
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        wsMessages.value.push({
          timestamp: new Date().toISOString(),
          data
        })
      } catch (error) {
        wsMessages.value.push({
          timestamp: new Date().toISOString(),
          data: { type: 'raw', message: event.data }
        })
      }
    }
    
    ws.onerror = (error) => {
      wsMessages.value.push({
        timestamp: new Date().toISOString(),
        data: { type: 'error', message: 'WebSocket error occurred' }
      })
    }
    
    ws.onclose = () => {
      wsMessages.value.push({
        timestamp: new Date().toISOString(),
        data: { type: 'connection', message: 'WebSocket disconnected' }
      })
    }
  } catch (error) {
    lastError.value = `WebSocket connection failed: ${error.message}`
  }
}

const createTestVitals = async () => {
  isLoading.value = true
  lastError.value = null
  
  try {
    // First get patients to use a real patient ID
    const patients = await getPatients()
    if (patients.length === 0) {
      throw new Error('No patients found. Please create a patient first.')
    }
    
    const testVitals = {
      patientId: patients[0].id,
      heartRate: Math.floor(Math.random() * 40) + 60,
      systolicBP: Math.floor(Math.random() * 40) + 110,
      diastolicBP: Math.floor(Math.random() * 20) + 70,
      temperature: (Math.random() * 2 + 97).toFixed(1),
      oxygenSaturation: Math.floor(Math.random() * 5) + 95,
      respiratoryRate: Math.floor(Math.random() * 8) + 12
    }
    
    const result = await createVitalSigns(testVitals)
    lastResponse.value = result
    isConnected.value = true
  } catch (error) {
    console.error('Create test vitals failed:', error)
    lastError.value = `Failed to create test vitals: ${error.data?.message || error.message}`
    isConnected.value = false
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Test connection on page load
  testConnection()
})

onUnmounted(() => {
  if (ws) {
    ws.close()
  }
})
</script>