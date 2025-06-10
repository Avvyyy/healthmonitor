import { Module } from '@nestjs/common';
import { HealthcareGateway } from './healthcare.gateway';
import { VitalSignsModule } from '../vital-signs/vital-signs.module';
import { AlertsModule } from '../alerts/alerts.module';
import { DevicesModule } from '../devices/devices.module';

@Module({
  imports: [VitalSignsModule, AlertsModule, DevicesModule],
  providers: [HealthcareGateway],
})
export class WebSocketModule {}