<template>
  <div 
    :class="[
      'bg-white rounded-lg shadow-sm border-2 p-6 transition-all duration-200 hover:shadow-md cursor-pointer',
      statusClasses[patient.status]
    ]"
    @click="$emit('viewDetails', patient.id)"
  >
    <!-- Patient Header -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ patient.name }}</h3>
        <p class="text-sm text-gray-500">Age {{ patient.age }} • Room {{ patient.room }}</p>
        <p class="text-sm text-gray-600 mt-1">{{ patient.condition }}</p>
      </div>
      <div class="flex items-center space-x-2">
        <span 
          :class="[
            'px-2 py-1 rounded-full text-xs font-medium',
            statusColors[patient.status]
          ]"
        >
          {{ statusLabels[patient.status] }}
        </span>
        <div :class="['w-3 h-3 rounded-full status-online', statusDots[patient.status]]"></div>
      </div>
    </div>

    <!-- Vital Signs Grid -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <!-- Heart Rate -->
      <div class="flex items-center space-x-3">
        <div :class="['p-2 rounded-lg', getVitalBg('heartRate')]">
          <Icon name="heroicons:heart" :class="['w-5 h-5', getVitalColor('heartRate')]" />
        </div>
        <div>
          <p class="text-sm text-gray-500">Heart Rate</p>
          <p :class="['text-lg font-semibold', getVitalTextColor('heartRate')]">
            {{ patient.vitals.heartRate.value }} <span class="text-sm">{{ patient.vitals.heartRate.unit }}</span>
          </p>
        </div>
      </div>

      <!-- Blood Pressure -->
      <div class="flex items-center space-x-3">
        <div :class="['p-2 rounded-lg', getVitalBg('bloodPressure')]">
          <Icon name="heroicons:chart-bar" :class="['w-5 h-5', getVitalColor('bloodPressure')]" />
        </div>
        <div>
          <p class="text-sm text-gray-500">Blood Pressure</p>
          <p :class="['text-lg font-semibold', getVitalTextColor('bloodPressure')]">
            {{ patient.vitals.bloodPressure.systolic }}/{{ patient.vitals.bloodPressure.diastolic }}
          </p>
        </div>
      </div>

      <!-- Temperature -->
      <div class="flex items-center space-x-3">
        <div :class="['p-2 rounded-lg', getVitalBg('temperature')]">
          <Icon name="heroicons:fire" :class="['w-5 h-5', getVitalColor('temperature')]" />
        </div>
        <div>
          <p class="text-sm text-gray-500">Temperature</p>
          <p :class="['text-lg font-semibold', getVitalTextColor('temperature')]">
            {{ patient.vitals.temperature.value }}{{ patient.vitals.temperature.unit }}
          </p>
        </div>
      </div>

      <!-- Oxygen Saturation -->
      <div class="flex items-center space-x-3">
        <div :class="['p-2 rounded-lg', getVitalBg('oxygenSaturation')]">
          <Icon name="heroicons:beaker" :class="['w-5 h-5', getVitalColor('oxygenSaturation')]" />
        </div>
        <div>
          <p class="text-sm text-gray-500">O2 Sat</p>
          <p :class="['text-lg font-semibold', getVitalTextColor('oxygenSaturation')]">
            {{ patient.vitals.oxygenSaturation.value }}{{ patient.vitals.oxygenSaturation.unit }}
          </p>
        </div>
      </div>
    </div>

    <!-- Last Updated -->
    <div class="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
      <span>Last updated: {{ formatTime(patient.lastUpdated) }}</span>
      <Icon name="heroicons:chevron-right" class="w-4 h-4" />
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'

const props = defineProps({
  patient: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['viewDetails'])

const statusClasses = {
  stable: 'border-green-200 hover:border-green-300',
  warning: 'border-yellow-200 hover:border-yellow-300',
  critical: 'border-red-200 hover:border-red-300 alert-critical'
}

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

const vitalStatusColors = {
  normal: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    text: 'text-green-700'
  },
  elevated: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-600',
    text: 'text-yellow-700'
  },
  high: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    text: 'text-red-700'
  },
  low: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    text: 'text-red-700'
  },
  slightly_elevated: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-600',
    text: 'text-yellow-700'
  }
}

const getVitalBg = (vitalType) => {
  const status = props.patient.vitals[vitalType].status
  return vitalStatusColors[status]?.bg || 'bg-gray-50'
}

const getVitalColor = (vitalType) => {
  const status = props.patient.vitals[vitalType].status
  return vitalStatusColors[status]?.icon || 'text-gray-600'
}

const getVitalTextColor = (vitalType) => {
  const status = props.patient.vitals[vitalType].status
  return vitalStatusColors[status]?.text || 'text-gray-700'
}

const formatTime = (date) => {
  return format(new Date(date), 'HH:mm:ss')
}
</script>