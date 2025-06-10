<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <Icon name="heroicons:heart" class="w-8 h-8 text-blue-600" />
              <h1 class="text-xl font-bold text-gray-900">HealthMonitor</h1>
            </div>
            <div class="hidden md:flex items-center space-x-1 text-sm text-gray-500">
              <Icon name="heroicons:signal" class="w-4 h-4 text-green-500" />
              <span>Connected</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Alert Bell -->
            <button class="p-2 rounded-full hover:bg-gray-100 relative">
              <Icon name="heroicons:bell" class="w-6 h-6 text-gray-600" />
              <span v-if="alertCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ alertCount }}
              </span>
            </button>
            
            <!-- User Profile -->
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Icon name="heroicons:user" class="w-5 h-5 text-white" />
              </div>
              <span class="hidden md:block text-sm font-medium text-gray-700">Dr. Smith</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
const alertCount = ref(3) // Mock alert count
</script>