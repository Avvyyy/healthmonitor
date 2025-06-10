<template>
  <div>
    <!-- Back Button -->
    <div class="mb-6">
      <button 
        @click="$router.back()"
        class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>
    </div>

    <div v-if="patient" class="space-y-6">
      <!-- Patient Header -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div class="flex items-start space-x-4">
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Icon name="heroicons:user" class="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ patient.name }}</h1>
              <div class="mt-1 text-sm text-gray-500 space-y-1">
                <p>Age: {{ patient.age }} years • Room: {{ patient.room }}</p>
                <p>Condition: {{ patient.condition }}</p>
                <p>Admitted: January 15, 2025</p>
              </div>
            </div>
          </div>
          <div class="mt-4 sm:mt-0">
            <span 
              :class="[
                'inline-flex items-center px-3 py-2 rounded-full text-sm font-medium',
                statusColors[patient.status]
              ]"
            >
              <span :class="['w-2 h-2 rounded-full mr-2', statusDots[patient.status]]"></span>
              {{ statusLabels[patient.status] }}
            </span>
          </div>
        </div>
      </div>

      <!-- Current Vitals Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <VitalCard
          title="Heart Rate"
          :value="patient.vitals.heartRate.value"
          :unit="patient.vitals.heartRate.unit"
          :status="patient.vitals.heartRate.status"
          icon="heroicons:heart"
          :normal-range="'60-100 bpm'"
        />
        <VitalCard
          title="Blood Pressure"
          :value="`${patient.vitals.bloodPressure.systolic}/${patient.vitals.bloodPressure.diastolic}`"
          unit="mmHg"
          :status="patient.vitals.bloodPressure.status"
          icon="heroicons:chart-bar"
          :normal-range="'<120/80 mmHg'"
        />
        <VitalCard
          title="Temperature"
          :value="patient.vitals.temperature.value"
          :unit="patient.vitals.temperature.unit"
          :status="patient.vitals.temperature.status"
          icon="heroicons:fire"
          :normal-range="'98.6°F (37°C)'"
        />
        <VitalCard
          title="Oxygen Saturation"
          :value="patient.vitals.oxygenSaturation.value"
          :unit="patient.vitals.oxygenSaturation.unit"
          :status="patient.vitals.oxygenSaturation.status"
          icon="heroicons:beaker"
          :normal-range="'>95%'"
        />
        <VitalCard
          title="Respiratory Rate"
          :value="patient.vitals.respiratoryRate.value"
          :unit="patient.vitals.respiratoryRate.unit"
          :status="patient.vitals.respiratoryRate.status"
          icon="heroicons:arrow-trending-up"
          :normal-range="'12-20 /min'"
        />
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Heart Rate Chart -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Heart Rate Trend (24h)</h3>
          <VitalChart 
            :data="heartRateData" 
            :options="chartOptions"
            type="line"
            color="#dc2626"
          />
        </div>

        <!-- Blood Pressure Chart -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Blood Pressure Trend (24h)</h3>
          <VitalChart 
            :data="bloodPressureData" 
            :options="chartOptions"
            type="line"
            color="#2563eb"
          />
        </div>

        <!-- Temperature Chart -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Temperature Trend (24h)</h3>
          <VitalChart 
            :data="temperatureData" 
            :options="chartOptions"
            type="line"
            color="#16a34a"
          />
        </div>

        <!-- Oxygen Saturation Chart -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">O2 Saturation Trend (24h)</h3>
          <VitalChart 
            :data="oxygenData" 
            :options="chartOptions"
            type="line"
            color="#0891b2"
          />
        </div>
      </div>

      <!-- Recent Alerts -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
        <div class="space-y-3">
          <div class="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-red-800">High Heart Rate Alert</p>
              <p class="text-xs text-red-600">Heart rate reached 110 bpm at 14:32</p>
            </div>
            <span class="text-xs text-red-500 ml-auto">2 min ago</span>
          </div>
          <div class="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <Icon name="heroicons:exclamation" class="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-yellow-800">Blood Pressure Warning</p>
              <p class="text-xs text-yellow-600">BP elevated to 160/100 mmHg at 13:15</p>
            </div>
            <span class="text-xs text-yellow-500 ml-auto">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="flex items-center justify-center h-64">
      <div class="medical-spinner"></div>
    </div>
  </div>
</template>

<script setup>
// Mock data - in real app, fetch from API
const route = useRoute()
const patientId = parseInt(route.params.id)

const patient = ref(null)

// Status configurations
const statusColors = {
  stable: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800'
}

const statusLabels = {
  stable: 'Stable',
  warning: 'Warning',
  critical: 'Critical'
}

const statusDots = {
  stable: 'bg-green-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500'
}

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: '#f1f5f9'
      }
    },
    x: {
      grid: {
        color: '#f1f5f9'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
}

// Mock chart data
const heartRateData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [{
    label: 'Heart Rate',
    data: [68, 72, 75, 85, 110, 95, 78],
    borderColor: '#dc2626',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    tension: 0.4
  }]
}

const bloodPressureData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [
    {
      label: 'Systolic',
      data: [118, 122, 125, 140, 160, 145, 130],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      tension: 0.4
    },
    {
      label: 'Diastolic',
      data: [78, 80, 82, 90, 100, 92, 85],
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124, 58, 237, 0.1)',
      tension: 0.4
    }
  ]
}

const temperatureData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [{
    label: 'Temperature',
    data: [98.4, 98.6, 99.1, 100.2, 99.8, 99.2, 98.9],
    borderColor: '#16a34a',
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    tension: 0.4
  }]
}

const oxygenData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [{
    label: 'Oxygen Saturation',
    data: [98, 97, 96, 94, 90, 92, 95],
    borderColor: '#0891b2',
    backgroundColor: 'rgba(8, 145, 178, 0.1)',
    tension: 0.4
  }]
}

// Load patient data
onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    // Mock patient data based on ID
    const patients = [
      {
        id: 1,
        name: 'John Smith',
        age: 45,
        room: 'ICU-101',
        condition: 'Post-Surgery Recovery',
        status: 'stable',
        vitals: {
          heartRate: { value: 72, status: 'normal', unit: 'bpm' },
          bloodPressure: { systolic: 120, diastolic: 80, status: 'normal' },
          temperature: { value: 98.6, status: 'normal', unit: '°F' },
          oxygenSaturation: { value: 98, status: 'normal', unit: '%' },
          respiratoryRate: { value: 16, status: 'normal', unit: '/min' }
        }
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        age: 32,
        room: 'Room 205',
        condition: 'Pneumonia',
        status: 'warning',
        vitals: {
          heartRate: { value: 95, status: 'elevated', unit: 'bpm' },
          bloodPressure: { systolic: 140, diastolic: 90, status: 'elevated' },
          temperature: { value: 101.2, status: 'elevated', unit: '°F' },
          oxygenSaturation: { value: 94, status: 'low', unit: '%' },
          respiratoryRate: { value: 22, status: 'elevated', unit: '/min' }
        }
      },
      {
        id: 3,
        name: 'Michael Davis',
        age: 67,
        room: 'ICU-102',
        condition: 'Cardiac Monitoring',
        status: 'critical',
        vitals: {
          heartRate: { value: 110, status: 'high', unit: 'bpm' },
          bloodPressure: { systolic: 160, diastolic: 100, status: 'high' },
          temperature: { value: 99.8, status: 'slightly_elevated', unit: '°F' },
          oxygenSaturation: { value: 90, status: 'low', unit: '%' },
          respiratoryRate: { value: 28, status: 'high', unit: '/min' }
        }
      }
    ]
    
    patient.value = patients.find(p => p.id === patientId)
  }, 500)
})
</script>