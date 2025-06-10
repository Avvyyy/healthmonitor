# Healthcare Monitoring System

A comprehensive real-time patient vital signs monitoring system built with **Nuxt 3** frontend and **NestJS** backend, featuring WebSocket-based live data streaming and wearable device integration.

## 🏥 System Architecture

### Frontend (Nuxt 3)
- **Real-time Dashboard**: Patient monitoring with live vital signs
- **Device Management**: Wearable device connection and monitoring
- **Interactive Charts**: Historical data visualization with Chart.js
- **Responsive Design**: Medical-grade UI with proper accessibility

### Backend (NestJS + Prisma + PostgreSQL)
- **RESTful API**: Complete CRUD operations for all entities
- **WebSocket Gateway**: Real-time bidirectional communication
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with role-based access
- **API Documentation**: Swagger/OpenAPI integration

## ✨ Features

### 🔴 Real-Time Monitoring
- **Live WebSocket Connection**: Real-time bidirectional communication
- **Continuous Vital Signs Streaming**: Heart rate, blood pressure, temperature, oxygen saturation
- **Automatic Alerts**: Smart alert system based on vital sign thresholds
- **Real-time Charts**: Live updating data visualization

### 👥 Patient Management
- **Complete Patient Records**: Demographics, medical history, room assignments
- **Vital Signs History**: Comprehensive tracking with device attribution
- **Status Classification**: Automatic categorization (Stable, Warning, Critical)
- **Care Team Assignment**: Assign doctors and nurses to patients

### 📱 Wearable Device Integration
- **Multi-Device Support**: Apple Watch, Oura Ring, Fitbit, Garmin, medical devices
- **Device Discovery & Connection**: Scan and connect available devices
- **Battery & Status Monitoring**: Track device health and connectivity
- **Real-time Data Streaming**: Live vital signs from connected devices

### 🚨 Alert System
- **Smart Thresholds**: Automatic alert generation based on vital sign ranges
- **Severity Levels**: Low, Medium, High, Critical alert classification
- **Real-time Notifications**: Instant WebSocket-based alert delivery
- **Alert Management**: Mark as read, resolve, assign to care team

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin, Doctor, Nurse, Technician roles
- **API Security**: Protected endpoints with proper authorization
- **Data Validation**: Comprehensive input validation and sanitization

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **PostgreSQL** 15+
- **npm** or **yarn**

### 1. Clone & Install
```bash
git clone <repository-url>
cd healthcare-monitoring-system

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Database Setup
```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Setup database
cd backend
npx prisma migrate dev
npx prisma generate
npx prisma db seed
cd ..
```

### 3. Environment Configuration
```bash
# Backend environment (backend/.env)
DATABASE_URL="postgresql://healthcare_user:healthcare_password@localhost:5432/healthcare_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

### 4. Start the System
```bash
# Start everything (WebSocket + Backend + Frontend)
npm run dev:full

# Or start individually:
# Terminal 1: WebSocket Server
npm run websocket

# Terminal 2: Backend API
npm run backend:dev

# Terminal 3: Frontend
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Database Studio**: `npm run db:studio`

## 📁 Project Structure

```
healthcare-monitoring-system/
├── frontend/                    # Nuxt 3 Frontend
│   ├── components/             # Vue components
│   ├── composables/           # Vue composables
│   ├── layouts/               # Page layouts
│   ├── pages/                 # Application pages
│   └── assets/                # Static assets
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # User management
│   │   ├── patients/          # Patient management
│   │   ├── devices/           # Device management
│   │   ├── vital-signs/       # Vital signs tracking
│   │   ├── alerts/            # Alert system
│   │   ├── websocket/         # WebSocket gateway
│   │   └── prisma/            # Database service
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Database seeding
│   └── .env                   # Environment variables
├── server/                     # WebSocket Server
│   └── websocket-server.cjs   # Standalone WebSocket server
└── docker-compose.yml         # Database services
```

## 🔧 Available Scripts

### Root Level
- `npm run dev:full` - Start complete system (WebSocket + Backend + Frontend)
- `npm run dev` - Start frontend only
- `npm run websocket` - Start WebSocket server only

### Backend
- `npm run backend:dev` - Start backend in development mode
- `npm run backend:build` - Build backend for production
- `npm run backend:start` - Start backend in production mode

### Database
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## 📊 Database Schema

### Core Entities
- **Users**: Healthcare staff (Admin, Doctor, Nurse, Technician)
- **Patients**: Patient records with demographics and medical info
- **Devices**: Wearable and medical devices with capabilities
- **VitalSigns**: Time-series vital signs data
- **Alerts**: Alert system with severity levels and assignments

### Key Relationships
- Users ↔ Patients (care team assignments)
- Patients ↔ Devices (device assignments)
- Patients ↔ VitalSigns (vital signs tracking)
- Patients ↔ Alerts (patient-specific alerts)
- Devices ↔ VitalSigns (device-attributed data)

## 🌐 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Patients
- `GET /patients` - List all patients
- `POST /patients` - Create new patient
- `GET /patients/:id` - Get patient details
- `GET /patients/:id/vitals` - Get patient vital signs
- `PATCH /patients/:id` - Update patient
- `DELETE /patients/:id` - Delete patient

### Devices
- `GET /devices` - List all devices
- `POST /devices` - Register new device
- `POST /devices/:id/connect` - Connect device to patient
- `POST /devices/:id/disconnect` - Disconnect device

### Vital Signs
- `GET /vital-signs` - List vital signs
- `POST /vital-signs` - Record new vital signs
- `GET /vital-signs/patient/:id` - Get patient vital signs
- `GET /vital-signs/device/:id` - Get device vital signs

### Alerts
- `GET /alerts` - List all alerts
- `GET /alerts/unresolved` - Get unresolved alerts
- `POST /alerts` - Create new alert
- `PATCH /alerts/:id/resolve` - Resolve alert

## 🔌 WebSocket Events

### Client → Server
- `join_patient_room` - Subscribe to patient updates
- `device_connect` - Connect device to patient
- `device_disconnect` - Disconnect device
- `vitals_data` - Send vital signs data

### Server → Client
- `vitals_update` - Real-time vital signs update
- `new_alert` - New alert notification
- `device_connected` - Device connection event
- `patient_vitals_update` - Patient-specific vital signs

## 🧪 Sample Data

The system includes comprehensive sample data:

### Sample Users
- **Admin**: admin@healthcare.com / password123
- **Doctor**: doctor@healthcare.com / password123  
- **Nurse**: nurse@healthcare.com / password123

### Sample Patients
- **John Smith** (Stable) - ICU-101, Post-Surgery Recovery
- **Sarah Johnson** (Warning) - Room 205, Pneumonia
- **Michael Davis** (Critical) - ICU-102, Cardiac Monitoring

### Sample Devices
- Apple Watch, Oura Ring, Fitbit with realistic vital signs data
- 24 hours of historical vital signs for each patient
- Sample alerts with different severity levels

## 🔒 Security Features

- **JWT Authentication** with configurable expiration
- **Role-based access control** (RBAC)
- **Input validation** with class-validator
- **CORS protection** with configurable origins
- **Password hashing** with bcryptjs
- **SQL injection protection** via Prisma ORM

## 🚀 Production Deployment

### Backend Deployment
1. **Build the application**
   ```bash
   cd backend && npm run build
   ```

2. **Set production environment variables**
   ```bash
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-production-jwt-secret"
   NODE_ENV="production"
   ```

3. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

4. **Start the application**
   ```bash
   npm run start:prod
   ```

### Frontend Deployment
1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform** (Vercel, Netlify, etc.)

### Database
- Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
- Configure connection pooling for production
- Set up automated backups
- Monitor database performance

## 📈 Monitoring & Observability

### Health Checks
- Database connectivity monitoring
- WebSocket connection health
- Device connectivity status
- Alert system responsiveness

### Metrics
- Real-time patient count
- Active device connections
- Alert response times
- System uptime

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Open an issue in the repository
- Check the API documentation at `/api/docs`
- Review the database schema in Prisma Studio

---

**⚕️ Built for Healthcare Professionals** - This system provides a solid foundation for real-time patient monitoring with room for customization based on specific healthcare requirements and compliance needs.