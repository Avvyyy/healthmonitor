import { PrismaClient, UserRole, Gender, PatientStatus, DeviceType, AlertType, AlertSeverity } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@healthcare.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  const doctor = await prisma.user.create({
    data: {
      email: 'doctor@healthcare.com',
      password: hashedPassword,
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      role: UserRole.DOCTOR,
    },
  });

  const nurse = await prisma.user.create({
    data: {
      email: 'nurse@healthcare.com',
      password: hashedPassword,
      firstName: 'Nurse',
      lastName: 'Smith',
      role: UserRole.NURSE,
    },
  });

  console.log('✅ Created users');

  // Create patients
  const patient1 = await prisma.patient.create({
    data: {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: new Date('1978-05-15'),
      gender: Gender.MALE,
      room: 'ICU-101',
      condition: 'Post-Surgery Recovery',
      status: PatientStatus.STABLE,
      userId: nurse.id,
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: new Date('1991-08-22'),
      gender: Gender.FEMALE,
      room: 'Room 205',
      condition: 'Pneumonia',
      status: PatientStatus.WARNING,
      userId: nurse.id,
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      firstName: 'Michael',
      lastName: 'Davis',
      dateOfBirth: new Date('1956-12-03'),
      gender: Gender.MALE,
      room: 'ICU-102',
      condition: 'Cardiac Monitoring',
      status: PatientStatus.CRITICAL,
      userId: doctor.id,
    },
  });

  console.log('✅ Created patients');

  // Create devices
  const appleWatch = await prisma.device.create({
    data: {
      name: 'John\'s Apple Watch',
      type: DeviceType.APPLE_WATCH,
      serialNumber: 'AW001234567',
      batteryLevel: 85,
      isConnected: true,
      capabilities: ['heart_rate', 'steps', 'calories', 'sleep'],
      patientId: patient1.id,
      lastSeen: new Date(),
    },
  });

  const ouraRing = await prisma.device.create({
    data: {
      name: 'Sarah\'s Oura Ring',
      type: DeviceType.OURA_RING,
      serialNumber: 'OR001234567',
      batteryLevel: 92,
      isConnected: true,
      capabilities: ['heart_rate', 'temperature', 'sleep', 'hrv'],
      patientId: patient2.id,
      lastSeen: new Date(),
    },
  });

  const fitbit = await prisma.device.create({
    data: {
      name: 'Michael\'s Fitbit',
      type: DeviceType.FITBIT,
      serialNumber: 'FB001234567',
      batteryLevel: 67,
      isConnected: true,
      capabilities: ['heart_rate', 'steps', 'calories', 'sleep'],
      patientId: patient3.id,
      lastSeen: new Date(),
    },
  });

  console.log('✅ Created devices');

  // Create sample vital signs
  const now = new Date();
  const vitalsData = [];

  // Generate vital signs for the last 24 hours
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // Every hour

    // Patient 1 - Stable
    vitalsData.push({
      patientId: patient1.id,
      deviceId: appleWatch.id,
      heartRate: Math.floor(Math.random() * 20) + 65, // 65-85
      systolicBP: Math.floor(Math.random() * 20) + 110, // 110-130
      diastolicBP: Math.floor(Math.random() * 15) + 70, // 70-85
      temperature: Math.random() * 1 + 98.0, // 98.0-99.0
      oxygenSaturation: Math.floor(Math.random() * 3) + 97, // 97-100
      respiratoryRate: Math.floor(Math.random() * 6) + 14, // 14-20
      steps: Math.floor(Math.random() * 1000) + 2000,
      calories: Math.floor(Math.random() * 200) + 300,
      timestamp,
    });

    // Patient 2 - Warning
    vitalsData.push({
      patientId: patient2.id,
      deviceId: ouraRing.id,
      heartRate: Math.floor(Math.random() * 25) + 80, // 80-105
      systolicBP: Math.floor(Math.random() * 30) + 130, // 130-160
      diastolicBP: Math.floor(Math.random() * 20) + 80, // 80-100
      temperature: Math.random() * 2 + 99.5, // 99.5-101.5
      oxygenSaturation: Math.floor(Math.random() * 4) + 93, // 93-97
      respiratoryRate: Math.floor(Math.random() * 8) + 18, // 18-26
      hrv: Math.floor(Math.random() * 20) + 25,
      timestamp,
    });

    // Patient 3 - Critical
    vitalsData.push({
      patientId: patient3.id,
      deviceId: fitbit.id,
      heartRate: Math.floor(Math.random() * 30) + 95, // 95-125
      systolicBP: Math.floor(Math.random() * 40) + 140, // 140-180
      diastolicBP: Math.floor(Math.random() * 25) + 85, // 85-110
      temperature: Math.random() * 1.5 + 99.0, // 99.0-100.5
      oxygenSaturation: Math.floor(Math.random() * 8) + 88, // 88-96
      respiratoryRate: Math.floor(Math.random() * 10) + 22, // 22-32
      steps: Math.floor(Math.random() * 500) + 500,
      calories: Math.floor(Math.random() * 100) + 200,
      timestamp,
    });
  }

  await prisma.vitalSigns.createMany({
    data: vitalsData,
  });

  console.log('✅ Created vital signs data');

  // Create sample alerts
  await prisma.alert.create({
    data: {
      type: AlertType.VITAL_SIGNS,
      severity: AlertSeverity.CRITICAL,
      title: 'High Heart Rate Alert',
      message: 'Heart rate reached 125 bpm',
      patientId: patient3.id,
      userId: doctor.id,
      triggeredAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    },
  });

  await prisma.alert.create({
    data: {
      type: AlertType.VITAL_SIGNS,
      severity: AlertSeverity.HIGH,
      title: 'Blood Pressure Warning',
      message: 'BP elevated to 160/100 mmHg',
      patientId: patient2.id,
      userId: nurse.id,
      triggeredAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    },
  });

  await prisma.alert.create({
    data: {
      type: AlertType.DEVICE_DISCONNECTED,
      severity: AlertSeverity.MEDIUM,
      title: 'Device Battery Low',
      message: 'Fitbit battery level is 15%',
      patientId: patient3.id,
      userId: nurse.id,
      triggeredAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isRead: true,
      isResolved: true,
      resolvedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
  });

  console.log('✅ Created alerts');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Sample login credentials:');
  console.log('Admin: admin@healthcare.com / password123');
  console.log('Doctor: doctor@healthcare.com / password123');
  console.log('Nurse: nurse@healthcare.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });