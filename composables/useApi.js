export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiUrl

  // Create a custom fetch function with authentication
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('auth_token')
    
    const defaultOptions = {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    }

    try {
      const response = await $fetch(endpoint, defaultOptions)
      return response
    } catch (error) {
      console.error('API Error:', error)
      
      // Handle authentication errors
      if (error.status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        await navigateTo('/login')
      }
      
      throw error
    }
  }

  // Authentication methods
  const login = async (credentials) => {
    try {
      const response = await $fetch('/auth/login', {
        method: 'POST',
        baseURL,
        body: credentials
      })
      
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token)
        localStorage.setItem('user', JSON.stringify(response.user))
      }
      
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await $fetch('/auth/register', {
        method: 'POST',
        baseURL,
        body: userData
      })
      return response
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    navigateTo('/login')
  }

  // Patient methods
  const getPatients = () => apiCall('/patients')
  const getPatient = (id) => apiCall(`/patients/${id}`)
  const createPatient = (data) => apiCall('/patients', { method: 'POST', body: data })
  const updatePatient = (id, data) => apiCall(`/patients/${id}`, { method: 'PATCH', body: data })
  const deletePatient = (id) => apiCall(`/patients/${id}`, { method: 'DELETE' })

  // Device methods
  const getDevices = () => apiCall('/devices')
  const getDevice = (id) => apiCall(`/devices/${id}`)
  const createDevice = (data) => apiCall('/devices', { method: 'POST', body: data })
  const connectDevice = (id, patientId) => apiCall(`/devices/${id}/connect`, { 
    method: 'POST', 
    body: { patientId } 
  })
  const disconnectDevice = (id) => apiCall(`/devices/${id}/disconnect`, { method: 'POST' })

  // Vital signs methods
  const getVitalSigns = () => apiCall('/vital-signs')
  const getPatientVitals = (patientId, limit = 100) => 
    apiCall(`/vital-signs/patient/${patientId}?limit=${limit}`)
  const createVitalSigns = (data) => apiCall('/vital-signs', { method: 'POST', body: data })

  // Alert methods
  const getAlerts = () => apiCall('/alerts')
  const getUnresolvedAlerts = () => apiCall('/alerts/unresolved')
  const createAlert = (data) => apiCall('/alerts', { method: 'POST', body: data })
  const markAlertAsRead = (id) => apiCall(`/alerts/${id}/read`, { method: 'PATCH' })
  const markAlertAsResolved = (id) => apiCall(`/alerts/${id}/resolve`, { method: 'PATCH' })

  return {
    // Auth
    login,
    register,
    logout,
    
    // Patients
    getPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,
    
    // Devices
    getDevices,
    getDevice,
    createDevice,
    connectDevice,
    disconnectDevice,
    
    // Vital Signs
    getVitalSigns,
    getPatientVitals,
    createVitalSigns,
    
    // Alerts
    getAlerts,
    getUnresolvedAlerts,
    createAlert,
    markAlertAsRead,
    markAlertAsResolved,
    
    // Raw API call
    apiCall
  }
}