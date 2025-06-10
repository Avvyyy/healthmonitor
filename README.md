# Healthcare Monitoring System

A real-time patient vital signs monitoring system built with Nuxt 3, featuring WebSocket-based live data streaming and wearable device integration.

## 🏥 Overview

This healthcare monitoring system enables real-time monitoring of patients through wearable health devices such as smartwatches and Oura rings. The system provides a comprehensive dashboard for healthcare professionals to monitor patient vital signs, manage device connections, and receive real-time alerts.

## ✨ Features

### 🔴 Real-Time Monitoring
- **Live WebSocket Connection**: Real-time bidirectional communication between frontend and backend
- **Continuous Vital Signs Streaming**: Heart rate, blood pressure, temperature, and oxygen saturation updates every 5 seconds
- **Connection Status Indicators**: Visual feedback showing WebSocket connection status
- **Real-time Alerts**: Instant notifications for critical patient conditions

### 👥 Patient Management
- **Patient Dashboard**: Overview of all patients with color-coded status indicators
- **Individual Patient Views**: Detailed patient profiles with comprehensive vital signs
- **Patient Registration**: Add new patients with medical information
- **Status Classification**: Automatic categorization (Stable, Warning, Critical)

### 📱 Wearable Device Integration
- **Multi-Device Support**: 
  - Apple Watch (Heart Rate, Steps, Calories, Sleep)
  - Oura Ring (Heart Rate, Temperature, Sleep, HRV)
  - Fitbit (Heart Rate, Steps, Calories, Sleep)
  - Garmin Watch (Heart Rate, GPS, Steps, Calories)
- **Device Discovery**: Scan and connect available wearable devices
- **Battery Monitoring**: Track device battery levels and connection status
- **Patient Assignment**: Connect devices to specific patients

### 📊 Data Visualization
- **Interactive Charts**: 24-hour trend visualization using Chart.js
- **Vital Signs Trends**: Historical data for heart rate, blood pressure, temperature, and oxygen saturation
- **Color-Coded Indicators**: Visual representation of normal/warning/critical ranges
- **Real-time Chart Updates**: Live data streaming to charts

### 🎨 User Interface
- **Medical-Grade Design**: Professional interface with proper color coding for medical environments
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Smooth Animations**: Professional transitions and micro-interactions
- **Accessibility**: High contrast ratios and readable fonts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthcare-monitoring-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the complete system**
   ```bash
   # Start both WebSocket server and Nuxt dev server
   npm run dev:full
   ```

   Or run them separately:
   ```bash
   # Terminal 1: Start WebSocket server
   npm run websocket
   
   # Terminal 2: Start Nuxt development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - WebSocket Server: ws://localhost:8080

## 📁 Project Structure

```
healthcare-monitoring-system/
├── components/
│   ├── DeviceConnectionStatus.vue    # Device status display
│   ├── DeviceManager.vue            # Device management interface
│   ├── PatientCard.vue              # Patient overview cards
│   ├── RealTimeIndicator.vue        # Live data indicators
│   ├── VitalCard.vue                # Individual vital sign cards
│   └── VitalChart.vue               # Chart components
├── composables/
│   ├── useWearableDevices.js        # Device management logic
│   └── useWebSocket.js              # WebSocket connection handling
├── layouts/
│   └── default.vue                  # Main application layout
├── pages/
│   ├── index.vue                    # Patient dashboard
│   ├── devices.vue                  # Device management page
│   └── patient/[id].vue             # Individual patient details
├── server/
│   └── websocket-server.js          # WebSocket server implementation
├── assets/css/
│   └── main.css                     # Global styles and medical animations
└── nuxt.config.ts                   # Nuxt configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start Nuxt development server
- `npm run websocket` - Start WebSocket server only
- `npm run dev:full` - Start both WebSocket server and Nuxt dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate` - Generate static site

## 📱 Application Pages

### 1. **Dashboard** (`/`)
- Main patient monitoring overview
- Quick stats (Total patients, Critical alerts, Warnings, Stable patients)
- Patient cards with real-time vital signs
- Add new patient functionality

### 2. **Device Management** (`/devices`)
- Wearable device scanning and discovery
- Device connection to patients
- Real-time connection statistics
- Device activity logs
- Supported device types overview

### 3. **Patient Details** (`/patient/[id]`)
- Comprehensive patient information
- Real-time vital signs monitoring
- 24-hour trend charts
- Recent alerts and notifications
- Patient medical history

## 🔌 WebSocket API

The WebSocket server provides real-time communication for:

### Connection Events
```javascript
// Connection established
{
  "type": "connection",
  "message": "Connected to healthcare monitoring WebSocket server",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### Vital Signs Data
```javascript
// Real-time vitals (sent every 5 seconds)
{
  "type": "vitals",
  "data": {
    "heartRate": 72,
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "temperature": "98.6",
    "oxygenSaturation": 98
  },
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### Device Events
```javascript
// Device connection
{
  "type": "device_connect",
  "deviceId": "apple_watch_001",
  "patientId": "patient_123",
  "timestamp": "2025-01-01T12:00:00.000Z"
}

// Device data
{
  "type": "vitals_data",
  "deviceId": "apple_watch_001",
  "patientId": "patient_123",
  "data": {
    "heart_rate": 75,
    "steps": 8500,
    "calories": 450
  },
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

## 🎯 Current Status

### ✅ Working Features
- ✅ WebSocket real-time connection
- ✅ Patient dashboard with live updates
- ✅ Device management system
- ✅ Individual patient detailed views
- ✅ Interactive charts and data visualization
- ✅ Responsive UI with medical-grade design
- ✅ Real-time vital signs simulation
- ✅ Device connection and status monitoring

### 🔄 Simulated Data
Currently using mock data for demonstration. The system is ready for integration with:
- Real wearable device APIs
- Hospital management systems
- Electronic Health Records (EHR)
- Medical device protocols (HL7, FHIR)

## 🛠 Technology Stack

- **Frontend**: Nuxt 3, Vue 3, Tailwind CSS
- **UI Components**: Nuxt UI, Heroicons
- **Charts**: Chart.js
- **Real-time**: WebSocket (ws library)
- **Styling**: Tailwind CSS with custom medical themes
- **Fonts**: Inter (Google Fonts)

## 🔒 Security Considerations

- WebSocket connections use secure protocols
- Patient data handling follows healthcare standards
- Device authentication and authorization ready
- HIPAA compliance considerations implemented

## 🚀 Production Deployment

For production deployment:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Configure environment variables**
   ```bash
   NUXT_PUBLIC_WEBSOCKET_URL=wss://your-websocket-server.com
   ```

3. **Deploy WebSocket server** to a cloud provider
4. **Deploy Nuxt application** using your preferred hosting platform

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Note**: This system currently uses simulated data for demonstration purposes. For production use, integrate with actual wearable device APIs and medical systems.