<template>
  <div :class="['bg-white rounded-lg shadow-sm border-2 p-6 transition-all duration-200', cardClasses[status]]">
    <div class="flex items-start justify-between">
      <div class="flex items-center space-x-3">
        <div :class="['p-3 rounded-lg', iconBgClasses[status]]">
          <Icon :name="icon" :class="['w-6 h-6', iconClasses[status]]" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
          <p :class="['text-2xl font-bold', textClasses[status]]">
            {{ value }}
            <span class="text-lg font-normal">{{ unit }}</span>
          </p>
          <p class="text-xs text-gray-400 mt-1">Normal: {{ normalRange }}</p>
        </div>
      </div>
      <div :class="['px-2 py-1 rounded-full text-xs font-medium', badgeClasses[status]]">
        {{ statusLabels[status] }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: [String, Number],
  unit: String,
  status: String,
  icon: String,
  normalRange: String
})

const cardClasses = {
  normal: 'border-green-200 bg-green-50/30',
  elevated: 'border-yellow-200 bg-yellow-50/30',
  high: 'border-red-200 bg-red-50/30',
  low: 'border-red-200 bg-red-50/30',
  slightly_elevated: 'border-yellow-200 bg-yellow-50/30'
}

const iconBgClasses = {
  normal: 'bg-green-100',
  elevated: 'bg-yellow-100',
  high: 'bg-red-100',
  low: 'bg-red-100',
  slightly_elevated: 'bg-yellow-100'
}

const iconClasses = {
  normal: 'text-green-600',
  elevated: 'text-yellow-600',
  high: 'text-red-600',
  low: 'text-red-600',
  slightly_elevated: 'text-yellow-600'
}

const textClasses = {
  normal: 'text-green-700',
  elevated: 'text-yellow-700',
  high: 'text-red-700',
  low: 'text-red-700',
  slightly_elevated: 'text-yellow-700'
}

const badgeClasses = {
  normal: 'bg-green-100 text-green-800',
  elevated: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
  low: 'bg-red-100 text-red-800',
  slightly_elevated: 'bg-yellow-100 text-yellow-800'
}

const statusLabels = {
  normal: 'Normal',
  elevated: 'Elevated',
  high: 'High',
  low: 'Low',
  slightly_elevated: 'Elevated'
}
</script>