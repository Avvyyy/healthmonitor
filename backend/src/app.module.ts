import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { DevicesModule } from './devices/devices.module';
import { VitalSignsModule } from './vital-signs/vital-signs.module';
import { AlertsModule } from './alerts/alerts.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PatientsModule,
    DevicesModule,
    VitalSignsModule,
    AlertsModule,
    WebSocketModule,
  ],
})
export class AppModule {}