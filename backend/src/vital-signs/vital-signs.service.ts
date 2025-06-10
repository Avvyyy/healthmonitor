import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVitalSignsDto } from './dto/create-vital-signs.dto';
import { UpdateVitalSignsDto } from './dto/update-vital-signs.dto';

@Injectable()
export class VitalSignsService {
  constructor(private prisma: PrismaService) {}

  async create(createVitalSignsDto: CreateVitalSignsDto) {
    return this.prisma.vitalSigns.create({
      data: createVitalSignsDto,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            room: true,
          },
        },
        device: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.vitalSigns.findMany({
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            room: true,
          },
        },
        device: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.vitalSigns.findUnique({
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
        device: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }

  async findByPatient(patientId: string, limit = 100) {
    return this.prisma.vitalSigns.findMany({
      where: { patientId },
      include: {
        device: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  async findByDevice(deviceId: string, limit = 100) {
    return this.prisma.vitalSigns.findMany({
      where: { deviceId },
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
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  async update(id: string, updateVitalSignsDto: UpdateVitalSignsDto) {
    return this.prisma.vitalSigns.update({
      where: { id },
      data: updateVitalSignsDto,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            room: true,
          },
        },
        device: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.vitalSigns.delete({
      where: { id },
    });
  }

  async getLatestByPatient(patientId: string) {
    return this.prisma.vitalSigns.findFirst({
      where: { patientId },
      orderBy: { timestamp: 'desc' },
      include: {
        device: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }
}