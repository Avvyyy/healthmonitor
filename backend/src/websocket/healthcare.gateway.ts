import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VitalSignsService } from '../vital-signs/vital-signs.service';
import { AlertsService } from '../alerts/alerts.service';
import { DevicesService } from '../devices/devices.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class HealthcareGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, Socket>();

  constructor(
    private vitalSignsService: VitalSignsService,
    private alertsService: AlertsService,
    private devicesService: DevicesService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
    
    // Send welcome message
    client.emit('connection', {
      message: 'Connected to healthcare monitoring WebSocket server',
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('join_patient_room')
  handleJoinPatientRoom(
    @MessageBody() data: { patientId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`patient_${data.patientId}`);
    client.emit('joined_room', {
      patientId: data.patientId,
      message: `Joined patient room: ${data.patientId}`,
    });
  }

  @SubscribeMessage('leave_patient_room')
  handleLeavePatientRoom(
    @MessageBody() data: { patientId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`patient_${data.patientId}`);
    client.emit('left_room', {
      patientId: data.patientId,
      message: `Left patient room: ${data.patientId}`,
    });
  }

  @SubscribeMessage('device_connect')
  async handleDeviceConnect(
    @MessageBody() data: { deviceId: string; patientId: string },
  ) {
    try {
      const device = await this.devicesService.connectToPatient(
        data.deviceId,
        data.patientId,
      );
      
      this.server.emit('device_connected', {
        device,
        timestamp: new Date().toISOString(),
      });
      
      // Notify patient room
      this.server.to(`patient_${data.patientId}`).emit('patient_device_connected', {
        device,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error connecting device:', error);
    }
  }

  @SubscribeMessage('device_disconnect')
  async handleDeviceDisconnect(@MessageBody() data: { deviceId: string }) {
    try {
      const device = await this.devicesService.disconnect(data.deviceId);
      
      this.server.emit('device_disconnected', {
        device,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error disconnecting device:', error);
    }
  }

  @SubscribeMessage('vitals_data')
  async handleVitalsData(
    @MessageBody() data: {
      patientId: string;
      deviceId?: string;
      vitals: any;
    },
  ) {
    try {
      const vitalSigns = await this.vitalSignsService.create({
        patientId: data.patientId,
        deviceId: data.deviceId,
        heartRate: data.vitals.heartRate,
        systolicBP: data.vitals.systolicBP,
        diastolicBP: data.vitals.diastolicBP,
        temperature: data.vitals.temperature,
        oxygenSaturation: data.vitals.oxygenSaturation,
        respiratoryRate: data.vitals.respiratoryRate,
        steps: data.vitals.steps,
        calories: data.vitals.calories,
        sleepScore: data.vitals.sleepScore,
        stressLevel: data.vitals.stressLevel,
        hrv: data.vitals.hrv,
        vo2Max: data.vitals.vo2Max,
      });

      // Broadcast to all clients
      this.server.emit('vitals_update', {
        vitalSigns,
        timestamp: new Date().toISOString(),
      });

      // Send to specific patient room
      this.server.to(`patient_${data.patientId}`).emit('patient_vitals_update', {
        vitalSigns,
        timestamp: new Date().toISOString(),
      });

      // Check for alerts based on vital signs
      await this.checkVitalSignsAlerts(data.patientId, data.vitals);
    } catch (error) {
      console.error('Error processing vitals data:', error);
    }
  }

  // Broadcast new alert to all clients
  async broadcastAlert(alert: any) {
    this.server.emit('new_alert', {
      alert,
      timestamp: new Date().toISOString(),
    });

    // Send to specific patient room
    this.server.to(`patient_${alert.patientId}`).emit('patient_alert', {
      alert,
      timestamp: new Date().toISOString(),
    });
  }

  // Check vital signs and create alerts if necessary
  private async checkVitalSignsAlerts(patientId: string, vitals: any) {
    const alerts = [];

    // Heart rate alerts
    if (vitals.heartRate) {
      if (vitals.heartRate > 100) {
        alerts.push({
          type: 'VITAL_SIGNS',
          severity: vitals.heartRate > 120 ? 'CRITICAL' : 'HIGH',
          title: 'High Heart Rate Alert',
          message: `Heart rate is ${vitals.heartRate} bpm`,
          patientId,
        });
      } else if (vitals.heartRate < 60) {
        alerts.push({
          type: 'VITAL_SIGNS',
          severity: vitals.heartRate < 40 ? 'CRITICAL' : 'MEDIUM',
          title: 'Low Heart Rate Alert',
          message: `Heart rate is ${vitals.heartRate} bpm`,
          patientId,
        });
      }
    }

    // Blood pressure alerts
    if (vitals.systolicBP && vitals.diastolicBP) {
      if (vitals.systolicBP > 140 || vitals.diastolicBP > 90) {
        alerts.push({
          type: 'VITAL_SIGNS',
          severity: vitals.systolicBP > 180 || vitals.diastolicBP > 110 ? 'CRITICAL' : 'HIGH',
          title: 'High Blood Pressure Alert',
          message: `Blood pressure is ${vitals.systolicBP}/${vitals.diastolicBP} mmHg`,
          patientId,
        });
      }
    }

    // Oxygen saturation alerts
    if (vitals.oxygenSaturation) {
      if (vitals.oxygenSaturation < 95) {
        alerts.push({
          type: 'VITAL_SIGNS',
          severity: vitals.oxygenSaturation < 90 ? 'CRITICAL' : 'HIGH',
          title: 'Low Oxygen Saturation Alert',
          message: `Oxygen saturation is ${vitals.oxygenSaturation}%`,
          patientId,
        });
      }
    }

    // Temperature alerts
    if (vitals.temperature) {
      if (vitals.temperature > 100.4) {
        alerts.push({
          type: 'VITAL_SIGNS',
          severity: vitals.temperature > 103 ? 'CRITICAL' : 'MEDIUM',
          title: 'High Temperature Alert',
          message: `Temperature is ${vitals.temperature}°F`,
          patientId,
        });
      }
    }

    // Create alerts in database and broadcast
    for (const alertData of alerts) {
      try {
        const alert = await this.alertsService.create(alertData);
        await this.broadcastAlert(alert);
      } catch (error) {
        console.error('Error creating alert:', error);
      }
    }
  }
}