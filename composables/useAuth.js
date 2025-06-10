export const useAuth = () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const { login: apiLogin, register: apiRegister, logout: apiLogout } = useApi()

  // Check if user is authenticated on app load
  const checkAuth = () => {
    if (process.client) {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          user.value = JSON.parse(userData)
          isAuthenticated.value = true
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
        }
      }
    }
  }

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials)
      user.value = response.user
      isAuthenticated.value = true
      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await apiRegister(userData)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    apiLogout()
  }

  // Initialize auth state
  onMounted(() => {
    checkAuth()
  })

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    login,
    register,
    logout,
    checkAuth
  }
}