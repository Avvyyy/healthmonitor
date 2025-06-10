export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()
  
  // Skip auth check for login page
  if (to.path === '/login') {
    return
  }
  
  // Check authentication on client side
  if (process.client && !isAuthenticated.value) {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return navigateTo('/login')
    }
  }
})