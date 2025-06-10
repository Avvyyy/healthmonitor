export const useWearableDevices = () => {
  const devices = ref([])
  const connectedDevices = ref([])
  const isScanning = ref(false)
  const { send, lastMessage, isConnected } = useWebSocket()

  // Mock device types that could be connected
  const deviceTypes = {
    'apple_watch': {
      name: 'Apple Watch',
      icon: 'heroicons:device-phone-mobile',
      capabilities: ['heart_rate', 'steps', 'calories', 'sleep']
    },
    'oura_ring': {
      name: 'Oura Ring',
      icon: 'heroicons:finger-print',
      capabilities: ['heart_rate', 'temperature', 'sleep', 'hrv']
    },
    'fitbit': {
      name: 'Fitbit',
      icon: 'heroicons:heart',
      capabilities: ['heart_rate', 'steps', 'calories', 'sleep']
    },
    'garmin': {
      name: 'Garmin Watch',
      icon: 'heroicons:clock',
      capabilities: ['heart_rate', 'gps', 'steps', 'calories']
    }
  }

  // Simulate device discovery
  const scanForDevices = async () => {
    isScanning.value = true
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock discovered devices
    devices.value = [
      {
        id: 'apple_watch_001',
        type: 'apple_watch',
        name: 'John\'s Apple Watch',
        batteryLevel: 85,
        lastSeen: new Date(),
        isConnected: false,
        patientId: null
      },
      {
        id: 'oura_ring_001',
        type: 'oura_ring',
        name: 'Sarah\'s Oura Ring',
        batteryLevel: 92,
        lastSeen: new Date(),
        isConnected: false,
        patientId: null
      },
      {
        id: 'fitbit_001',
        type: 'fitbit',
        name: 'Michael\'s Fitbit',
        batteryLevel: 67,
        lastSeen: new Date(),
        isConnected: false,
        patientId: null
      }
    ]
    
    isScanning.value = false
  }

  // Connect a device to a patient
  const connectDevice = async (deviceId, patientId) => {
    const device = devices.value.find(d => d.id === deviceId)
    if (device) {
      device.isConnected = true
      device.patientId = patientId
      device.connectedAt = new Date()
      
      connectedDevices.value.push(device)
      
      // Send connection request via WebSocket
      if (isConnected.value) {
        send({
          type: 'device_connect',
          deviceId,
          patientId,
          timestamp: new Date().toISOString()
        })
      }
      
      // Start simulating real-time data
      startDataSimulation(device)
    }
  }

  // Disconnect a device
  const disconnectDevice = (deviceId) => {
    const deviceIndex = connectedDevices.value.findIndex(d => d.id === deviceId)
    if (deviceIndex !== -1) {
      const device = connectedDevices.value[deviceIndex]
      device.isConnected = false
      device.patientId = null
      
      connectedDevices.value.splice(deviceIndex, 1)
      
      if (isConnected.value) {
        send({
          type: 'device_disconnect',
          deviceId,
          timestamp: new Date().toISOString()
        })
      }
    }
  }

  // Simulate real-time data from connected devices
  const startDataSimulation = (device) => {
    const interval = setInterval(() => {
      if (!device.isConnected) {
        clearInterval(interval)
        return
      }

      const vitalsData = generateMockVitals(device.type)
      
      if (isConnected.value) {
        send({
          type: 'vitals_data',
          deviceId: device.id,
          patientId: device.patientId,
          data: vitalsData,
          timestamp: new Date().toISOString()
        })
      }
    }, 5000) // Send data every 5 seconds
  }

  // Generate mock vital signs based on device type
  const generateMockVitals = (deviceType) => {
    const baseVitals = {
      heart_rate: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
      timestamp: new Date().toISOString()
    }

    switch (deviceType) {
      case 'apple_watch':
        return {
          ...baseVitals,
          steps: Math.floor(Math.random() * 1000) + 5000,
          calories: Math.floor(Math.random() * 200) + 300
        }
      
      case 'oura_ring':
        return {
          ...baseVitals,
          temperature: (Math.random() * 2 + 97.5).toFixed(1), // 97.5-99.5°F
          hrv: Math.floor(Math.random() * 30) + 20 // 20-50ms
        }
      
      case 'fitbit':
        return {
          ...baseVitals,
          steps: Math.floor(Math.random() * 1000) + 4000,
          sleep_score: Math.floor(Math.random() * 30) + 70
        }
      
      case 'garmin':
        return {
          ...baseVitals,
          vo2_max: Math.floor(Math.random() * 20) + 40,
          stress_level: Math.floor(Math.random() * 100)
        }
      
      default:
        return baseVitals
    }
  }

  // Get device info by type
  const getDeviceInfo = (type) => {
    return deviceTypes[type] || { name: 'Unknown Device', icon: 'heroicons:device-phone-mobile', capabilities: [] }
  }

  return {
    devices: readonly(devices),
    connectedDevices: readonly(connectedDevices),
    isScanning: readonly(isScanning),
    deviceTypes,
    scanForDevices,
    connectDevice,
    disconnectDevice,
    getDeviceInfo
  }
}