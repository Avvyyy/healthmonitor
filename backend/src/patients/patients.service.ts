import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto) {
    return this.prisma.patient.create({
      data: createPatientDto,
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.patient.findMany({
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        vitalSigns: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
        devices: true,
        _count: {
          select: {
            alerts: {
              where: { isResolved: false },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.patient.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        vitalSigns: {
          orderBy: { timestamp: 'desc' },
          take: 50,
        },
        devices: true,
        alerts: {
          orderBy: { triggeredAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    return this.prisma.patient.update({
      where: { id },
      data: updatePatientDto,
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.patient.delete({
      where: { id },
    });
  }

  async getPatientVitals(id: string, limit = 100) {
    return this.prisma.vitalSigns.findMany({
      where: { patientId: id },
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        device: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });
  }
}