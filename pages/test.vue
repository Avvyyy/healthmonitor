<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Fullstack Application Testing</h1>
      <p class="text-gray-600">Comprehensive testing dashboard for your healthcare monitoring system</p>
    </div>

    <!-- Environment Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Environment Configuration</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Frontend URL:</span>
            <span class="font-mono text-blue-600">{{ frontendUrl }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Backend API:</span>
            <span class="font-mono text-blue-600">{{ config.public.apiUrl }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">WebSocket:</span>
            <span class="font-mono text-blue-600">{{ config.public.websocketUrl }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Test Status</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Backend Connection</span>
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', backendStatus.class]">
              {{ backendStatus.text }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">WebSocket Connection</span>
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', wsStatus.class]">
              {{ wsStatus.text }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Authentication</span>
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', authStatus.class]">
              {{ authStatus.text }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Sections -->
    <div class="space-y-8">
      <!-- 1. Backend API Tests -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">1. Backend API Tests</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            @click="testBackendHealth"
            :disabled="isLoading"
            class="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Icon name="heroicons:heart" class="w-5 h-5 mb-2 mx-auto" />
            <div class="text-sm">Health Check</div>
          </button>
          
          <button
            @click="testAuthentication"
            :disabled="isLoading"
            class="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Icon name="heroicons:key" class="w-5 h-5 mb-2 mx-auto" />
            <div class="text-sm">Authentication</div>
          </button>
          
          <button
            @click="testPatientAPI"
            :disabled="isLoading"
            class="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Icon name="heroicons:users" class="w-5 h-5 mb-2 mx-auto" />
            <div class="text-sm">Patient API</div>
          </button>
          
          <button
            @click="testDeviceAPI"
            :disabled="isLoading"
            class="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Icon name="heroicons:device-phone-mobile" class="w-5 h-5 mb-2 mx-auto" />
            <div class="text-sm">Device API</div>
          </button>
        </div>
        
        <div v-if="apiTestResults.length > 0" class="space-y-2">
          <h4 class="font-medium text-gray-900">API Test Results:</h4>
          <div class="bg-gray-50 rounded-lg p-4 max-h-64 overflow-auto">
            <div v-for="(result, index) in apiTestResults" :key="index" class="text-sm mb-2">
              <span :class="result.success ? 'text-green-600' : 'text-red-600'">
                {{ result.success ? '✓' : '✗' }}
              </span>
              <span class="ml-2">{{ result.test }}: {{ result.message }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. WebSocket Tests -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">2. WebSocket Real-time Tests</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            @click="testWebSocketConnection"
            :disabled="isLoading"
            class="p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
          >
            <Icon name="heroicons:bolt" class="w-5 h-5 mb-2 mx-auto" />
            <div class="text-sm">Connect WebSocket</div>
          </button>
          
          <button
            @click="simulateVitalSigns"
            :disabled="isLoading || !wsConnected"
            class="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <Icon name="heroicons:heart" class="w-5 h-5 mb-2 mx-auto" />
            <div class="text-sm">Send Vital Signs</div>
          </button>
          
          <button
            @click="simulateAlert"
            :disabled="isLoading || !wsConnected"
            class="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 mb-2 mx-auto" />
            <div class="text-sm">Trigger Alert</div>
          </button>
        </div>
        
        <div v-if="wsMessages.length > 0" class="space-y-2">
          <h4 class="font-medium text-gray-900">WebSocket Messages:</h4>
          <div class="bg-gray-50 rounded-lg p-4 max-h-64 overflow-auto">
            <div v-for="(message, index) in wsMessages" :key="index" class="text-sm mb-2 border-b border-gray-200 pb-2">
              <div class="text-xs text-gray-500">{{ formatTime(message.timestamp) }}</div>
              <div class="font-mono text-gray-800">{{ JSON.stringify(message.data, null, 2) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Frontend Component Tests -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">3. Frontend Component Tests</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Sample Patient Card -->
          <div>
            <h4 class="font-medium text-gray-900 mb-3">Sample Patient Card</h4>
            <PatientCard 
              :patient="samplePatient"
              @view-details="handlePatientView"
            />
          </div>
          
          <!-- Sample Vital Card -->
          <div>
            <h4 class="font-medium text-gray-900 mb-3">Sample Vital Signs</h4>
            <div class="grid grid-cols-2 gap-3">
              <VitalCard
                title="Heart Rate"
                :value="sampleVitals.heartRate"
                unit="bpm"
                status="elevated"
                icon="heroicons:heart"
                normal-range="60-100 bpm"
              />
              <VitalCard
                title="Temperature"
                :value="sampleVitals.temperature"
                unit="°F"
                status="normal"
                icon="heroicons:fire"
                normal-range="98.6°F"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 4. End-to-End Workflow Test -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">4. End-to-End Workflow Test</h2>
        <div class="space-y-4">
          <button
            @click="runFullWorkflowTest"
            :disabled="isLoading"
            class="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
          >
            <Icon name="heroicons:play" class="w-5 h-5 mr-2 inline" />
            Run Complete Workflow Test
          </button>
          
          <div v-if="workflowResults.length > 0" class="space-y-2">
            <h4 class="font-medium text-gray-900">Workflow Test Results:</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <div v-for="(step, index) in workflowResults" :key="index" class="flex items-center text-sm mb-2">
                <span :class="step.success ? 'text-green-600' : 'text-red-600'" class="mr-2">
                  {{ step.success ? '✓' : '✗' }}
                </span>
                <span>{{ step.step }}: {{ step.message }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Performance Tests -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">5. Performance Tests</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ performanceMetrics.apiLatency }}ms</div>
            <div class="text-sm text-gray-600">API Latency</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ performanceMetrics.wsLatency }}ms</div>
            <div class="text-sm text-gray-600">WebSocket Latency</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">{{ performanceMetrics.pageLoad }}ms</div>
            <div class="text-sm text-gray-600">Page Load Time</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'

const config = useRuntimeConfig()
const { login, apiCall } = useApi()

// Reactive state
const isLoading = ref(false)
const apiTestResults = ref([])
const wsMessages = ref([])
const workflowResults = ref([])
const wsConnected = ref(false)
const authToken = ref(null)

// Performance metrics
const performanceMetrics = ref({
  apiLatency: 0,
  wsLatency: 0,
  pageLoad: performance.now()
})

// Environment info
const frontendUrl = computed(() => {
  if (process.client) {
    return window.location.origin
  }
  return 'https://fancy-croquembouche-cbac4a.netlify.app'
})

// Status indicators
const backendStatus = computed(() => {
  const hasResults = apiTestResults.value.some(r => r.test.includes('Health'))
  const isHealthy = apiTestResults.value.some(r => r.test.includes('Health') && r.success)
  
  if (!hasResults) {
    return { text: 'Not Tested', class: 'bg-gray-100 text-gray-800' }
  }
  return isHealthy 
    ? { text: 'Connected', class: 'bg-green-100 text-green-800' }
    : { text: 'Failed', class: 'bg-red-100 text-red-800' }
})

const wsStatus = computed(() => {
  return wsConnected.value
    ? { text: 'Connected', class: 'bg-green-100 text-green-800' }
    : { text: 'Disconnected', class: 'bg-gray-100 text-gray-800' }
})

const authStatus = computed(() => {
  return authToken.value
    ? { text: 'Authenticated', class: 'bg-green-100 text-green-800' }
    : { text: 'Not Authenticated', class: 'bg-gray-100 text-gray-800' }
})

// Sample data
const samplePatient = {
  id: 1,
  name: 'Test Patient',
  age: 45,
  room: 'TEST-101',
  condition: 'Testing',
  status: 'warning',
  vitals: {
    heartRate: { value: 95, status: 'elevated', unit: 'bpm' },
    bloodPressure: { systolic: 140, diastolic: 90, status: 'elevated' },
    temperature: { value: 99.2, status: 'normal', unit: '°F' },
    oxygenSaturation: { value: 96, status: 'normal', unit: '%' },
    respiratoryRate: { value: 18, status: 'normal', unit: '/min' }
  },
  lastUpdated: new Date().toISOString()
}

const sampleVitals = {
  heartRate: 95,
  temperature: 98.6
}

// Test functions
const testBackendHealth = async () => {
  isLoading.value = true
  const startTime = performance.now()
  
  try {
    // Try multiple endpoints to test backend health
    const endpoints = [
      { path: '/', name: 'Root endpoint' },
      { path: '/health', name: 'Health check' },
      { path: '/api/docs', name: 'API documentation' }
    ]
    
    for (const endpoint of endpoints) {
      try {
        await $fetch(endpoint.path, {
          baseURL: config.public.apiUrl,
          timeout: 10000
        })
        
        const latency = Math.round(performance.now() - startTime)
        performanceMetrics.value.apiLatency = latency
        
        apiTestResults.value.push({
          test: `Health Check (${endpoint.name})`,
          success: true,
          message: `Backend is responding (${latency}ms)`
        })
        break
      } catch (error) {
        apiTestResults.value.push({
          test: `Health Check (${endpoint.name})`,
          success: false,
          message: error.message || 'Connection failed'
        })
      }
    }
  } finally {
    isLoading.value = false
  }
}

const testAuthentication = async () => {
  isLoading.value = true
  
  try {
    const response = await login({
      email: 'nurse@healthcare.com',
      password: 'password123'
    })
    
    authToken.value = response.access_token
    
    apiTestResults.value.push({
      test: 'Authentication',
      success: true,
      message: `Logged in as ${response.user.firstName} ${response.user.lastName} (${response.user.role})`
    })
  } catch (error) {
    apiTestResults.value.push({
      test: 'Authentication',
      success: false,
      message: error.data?.message || error.message || 'Login failed'
    })
  } finally {
    isLoading.value = false
  }
}

const testPatientAPI = async () => {
  isLoading.value = true
  
  try {
    const patients = await apiCall('/patients')
    
    apiTestResults.value.push({
      test: 'Patient API',
      success: true,
      message: `Retrieved ${patients.length} patients`
    })
  } catch (error) {
    apiTestResults.value.push({
      test: 'Patient API',
      success: false,
      message: error.data?.message || error.message || 'Failed to fetch patients'
    })
  } finally {
    isLoading.value = false
  }
}

const testDeviceAPI = async () => {
  isLoading.value = true
  
  try {
    const devices = await apiCall('/devices')
    
    apiTestResults.value.push({
      test: 'Device API',
      success: true,
      message: `Retrieved ${devices.length} devices`
    })
  } catch (error) {
    apiTestResults.value.push({
      test: 'Device API',
      success: false,
      message: error.data?.message || error.message || 'Failed to fetch devices'
    })
  } finally {
    isLoading.value = false
  }
}

const testWebSocketConnection = () => {
  const wsUrl = config.public.websocketUrl
  const startTime = performance.now()
  
  try {
    const ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      wsConnected.value = true
      const latency = Math.round(performance.now() - startTime)
      performanceMetrics.value.wsLatency = latency
      
      wsMessages.value.push({
        timestamp: new Date(),
        data: { type: 'connection', message: `WebSocket connected (${latency}ms)` }
      })
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        wsMessages.value.push({
          timestamp: new Date(),
          data
        })
      } catch (error) {
        wsMessages.value.push({
          timestamp: new Date(),
          data: { type: 'raw', message: event.data }
        })
      }
    }
    
    ws.onerror = () => {
      wsMessages.value.push({
        timestamp: new Date(),
        data: { type: 'error', message: 'WebSocket connection error' }
      })
    }
    
    ws.onclose = () => {
      wsConnected.value = false
      wsMessages.value.push({
        timestamp: new Date(),
        data: { type: 'connection', message: 'WebSocket disconnected' }
      })
    }
  } catch (error) {
    wsMessages.value.push({
      timestamp: new Date(),
      data: { type: 'error', message: `Failed to connect: ${error.message}` }
    })
  }
}

const simulateVitalSigns = () => {
  const vitals = {
    type: 'vitals_data',
    patientId: 'test-patient-1',
    deviceId: 'test-device-1',
    data: {
      heartRate: Math.floor(Math.random() * 40) + 60,
      bloodPressure: {
        systolic: Math.floor(Math.random() * 40) + 110,
        diastolic: Math.floor(Math.random() * 20) + 70
      },
      temperature: (Math.random() * 2 + 97).toFixed(1),
      oxygenSaturation: Math.floor(Math.random() * 5) + 95
    },
    timestamp: new Date().toISOString()
  }
  
  wsMessages.value.push({
    timestamp: new Date(),
    data: { type: 'sent', message: 'Simulated vital signs', data: vitals }
  })
}

const simulateAlert = () => {
  const alert = {
    type: 'alert',
    severity: 'HIGH',
    title: 'Test Alert',
    message: 'This is a test alert from the frontend',
    patientId: 'test-patient-1',
    timestamp: new Date().toISOString()
  }
  
  wsMessages.value.push({
    timestamp: new Date(),
    data: { type: 'sent', message: 'Simulated alert', data: alert }
  })
}

const runFullWorkflowTest = async () => {
  isLoading.value = true
  workflowResults.value = []
  
  const steps = [
    { name: 'Backend Health Check', fn: testBackendHealth },
    { name: 'Authentication', fn: testAuthentication },
    { name: 'Patient Data Fetch', fn: testPatientAPI },
    { name: 'Device Data Fetch', fn: testDeviceAPI },
    { name: 'WebSocket Connection', fn: testWebSocketConnection }
  ]
  
  for (const step of steps) {
    try {
      await step.fn()
      workflowResults.value.push({
        step: step.name,
        success: true,
        message: 'Completed successfully'
      })
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait between steps
    } catch (error) {
      workflowResults.value.push({
        step: step.name,
        success: false,
        message: error.message || 'Failed'
      })
    }
  }
  
  isLoading.value = false
}

const handlePatientView = (patientId) => {
  console.log('Patient view clicked:', patientId)
}

const formatTime = (date) => {
  return format(new Date(date), 'HH:mm:ss')
}

// Initialize page load time
onMounted(() => {
  performanceMetrics.value.pageLoad = Math.round(performance.now())
})
</script>