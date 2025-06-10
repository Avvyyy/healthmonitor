export const useWebSocket = () => {
  const socket = ref(null)
  const isConnected = ref(false)
  const connectionStatus = ref('disconnected')
  const lastMessage = ref(null)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const config = useRuntimeConfig()

  const connect = (url = config.public.websocketUrl) => {
    try {
      socket.value = new WebSocket(url)
      
      socket.value.onopen = () => {
        isConnected.value = true
        connectionStatus.value = 'connected'
        reconnectAttempts.value = 0
        console.log('WebSocket connected')
      }
      
      socket.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          lastMessage.value = data
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      socket.value.onclose = () => {
        isConnected.value = false
        connectionStatus.value = 'disconnected'
        console.log('WebSocket disconnected')
        
        // Auto-reconnect logic
        if (reconnectAttempts.value < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts.value++
            connectionStatus.value = 'reconnecting'
            connect(url)
          }, 3000 * reconnectAttempts.value)
        }
      }
      
      socket.value.onerror = (error) => {
        console.error('WebSocket error:', error)
        connectionStatus.value = 'error'
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      connectionStatus.value = 'error'
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
  }

  const send = (data) => {
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify(data))
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    socket: readonly(socket),
    isConnected: readonly(isConnected),
    connectionStatus: readonly(connectionStatus),
    lastMessage: readonly(lastMessage),
    connect,
    disconnect,
    send
  }
}