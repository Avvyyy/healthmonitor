const WebSocket = require('ws')

// Create WebSocket server
const wss = new WebSocket.Server({ 
  port: 8080,
  host: '127.0.0.1'
})

console.log('WebSocket server starting on ws://localhost:8080')

// Store connected clients
const clients = new Set()

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection established')
  clients.add(ws)
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to healthcare monitoring WebSocket server',
    timestamp: new Date().toISOString()
  }))
  
  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString())
      console.log('Received message:', message)
      
      // Echo message back to sender
      ws.send(JSON.stringify({
        type: 'echo',
        data: message,
        timestamp: new Date().toISOString()
      }))
      
      // Broadcast to all other clients if needed
      if (message.broadcast) {
        clients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'broadcast',
              data: message,
              timestamp: new Date().toISOString()
            }))
          }
        })
      }
    } catch (error) {
      console.error('Error parsing message:', error)
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid JSON format',
        timestamp: new Date().toISOString()
      }))
    }
  })
  
  // Handle connection close
  ws.on('close', () => {
    console.log('WebSocket connection closed')
    clients.delete(ws)
  })
  
  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
    clients.delete(ws)
  })
  
  // Send periodic heartbeat/test data for healthcare monitoring
  const heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'vitals',
        data: {
          heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
          bloodPressure: {
            systolic: Math.floor(Math.random() * 40) + 110, // 110-150
            diastolic: Math.floor(Math.random() * 20) + 70   // 70-90
          },
          temperature: (Math.random() * 2 + 97).toFixed(1), // 97-99°F
          oxygenSaturation: Math.floor(Math.random() * 5) + 95 // 95-100%
        },
        timestamp: new Date().toISOString()
      }))
    }
  }, 5000) // Send every 5 seconds
  
  // Clear heartbeat on close
  ws.on('close', () => {
    clearInterval(heartbeat)
  })
})

wss.on('error', (error) => {
  console.error('WebSocket server error:', error)
})

console.log('WebSocket server is running on ws://localhost:8080')