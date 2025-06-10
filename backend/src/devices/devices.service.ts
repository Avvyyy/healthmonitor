import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async create(createDeviceDto: CreateDeviceDto) {
    return this.prisma.device.create({
      data: createDeviceDto,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            room: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.device.findMany({
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            room: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.device.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            room: true,
          },
        },
        vitalSigns: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    });
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    return this.prisma.device.update({
      where: { id },
      data: updateDeviceDto,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            room: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.device.delete({
      where: { id },
    });
  }

  async connectToPatient(deviceId: string, patientId: string) {
    return this.prisma.device.update({
      where: { id: deviceId },
      data: {
        patientId,
        isConnected: true,
        lastSeen: new Date(),
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            room: true,
          },
        },
      },
    });
  }

  async disconnect(deviceId: string) {
    return this.prisma.device.update({
      where: { id: deviceId },
      data: {
        patientId: null,
        isConnected: false,
      },
    });
  }

  async updateBatteryLevel(deviceId: string, batteryLevel: number) {
    return this.prisma.device.update({
      where: { id: deviceId },
      data: {
        batteryLevel,
        lastSeen: new Date(),
      },
    });
  }
}