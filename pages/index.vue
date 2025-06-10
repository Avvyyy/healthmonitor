<template>
  <div>
    <!-- Dashboard Header -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Patient Monitoring Dashboard</h2>
          <p class="mt-1 text-sm text-gray-500">Real-time vital signs monitoring for {{ patients.length }} patients</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button 
            @click="addPatient"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
            Add Patient
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:users" class="w-8 h-8 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Patients</p>
            <p class="text-2xl font-semibold text-gray-900">{{ patients.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Critical Alerts</p>
            <p class="text-2xl font-semibold text-red-600">{{ criticalAlerts }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:exclamation" class="w-8 h-8 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Warnings</p>
            <p class="text-2xl font-semibold text-yellow-600">{{ warnings }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:check-circle" class="w-8 h-8 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Stable</p>
            <p class="text-2xl font-semibold text-green-600">{{ stablePatients }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Patient Cards Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <PatientCard 
        v-for="patient in patients" 
        :key="patient.id" 
        :patient="patient"
        @view-details="viewPatientDetails"
      />
    </div>

    <!-- Add Patient Modal -->
    <UModal v-model="showAddPatientModal">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Patient</h3>
        <form @submit.prevent="submitNewPatient" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              v-model="newPatient.name"
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input 
                v-model="newPatient.age"
                type="number" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Room</label>
              <input 
                v-model="newPatient.room"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Medical Condition</label>
            <input 
              v-model="newPatient.condition"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              @click="showAddPatientModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </UModal>
  </div>
</template>

<script setup>
// Mock patient data
const patients = ref([
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
    },
    lastUpdated: '2024-01-01T12:00:00Z'
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
    },
    lastUpdated: '2024-01-01T12:05:00Z'
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
    },
    lastUpdated: '2024-01-01T12:10:00Z'
  }
])

// Computed stats
const criticalAlerts = computed(() => patients.value.filter(p => p.status === 'critical').length)
const warnings = computed(() => patients.value.filter(p => p.status === 'warning').length)
const stablePatients = computed(() => patients.value.filter(p => p.status === 'stable').length)

// Modal state
const showAddPatientModal = ref(false)
const newPatient = ref({
  name: '',
  age: '',
  room: '',
  condition: ''
})

// Functions
const addPatient = () => {
  showAddPatientModal.value = true
}

const submitNewPatient = () => {
  const patient = {
    id: patients.value.length + 1,
    ...newPatient.value,
    age: parseInt(newPatient.value.age),
    status: 'stable',
    vitals: {
      heartRate: { value: 72, status: 'normal', unit: 'bpm' },
      bloodPressure: { systolic: 120, diastolic: 80, status: 'normal' },
      temperature: { value: 98.6, status: 'normal', unit: '°F' },
      oxygenSaturation: { value: 98, status: 'normal', unit: '%' },
      respiratoryRate: { value: 16, status: 'normal', unit: '/min' }
    },
    lastUpdated: new Date().toISOString()
  }
  
  patients.value.push(patient)
  showAddPatientModal.value = false
  newPatient.value = { name: '', age: '', room: '', condition: '' }
}

const viewPatientDetails = (patientId) => {
  navigateTo(`/patient/${patientId}`)
}

// Simulate real-time updates
onMounted(() => {
  const interval = setInterval(() => {
    patients.value.forEach(patient => {
      // Simulate vital signs changes
      patient.vitals.heartRate.value += Math.floor(Math.random() * 6) - 3
      patient.vitals.oxygenSaturation.value += Math.floor(Math.random() * 4) - 2
      patient.lastUpdated = new Date().toISOString()
    })
  }, 5000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>