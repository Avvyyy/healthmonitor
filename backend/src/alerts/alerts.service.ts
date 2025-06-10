import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async create(createAlertDto: CreateAlertDto) {
    return this.prisma.alert.create({
      data: createAlertDto,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            room: true,
          },
        },
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
    return this.prisma.alert.findMany({
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            room: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { triggeredAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.alert.findUnique({
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

  async findByPatient(patientId: string) {
    return this.prisma.alert.findMany({
      where: { patientId },
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
      orderBy: { triggeredAt: 'desc' },
    });
  }

  async findUnresolved() {
    return this.prisma.alert.findMany({
      where: { isResolved: false },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            room: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { triggeredAt: 'desc' },
    });
  }

  async update(id: string, updateAlertDto: UpdateAlertDto) {
    return this.prisma.alert.update({
      where: { id },
      data: updateAlertDto,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            room: true,
          },
        },
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

  async markAsRead(id: string) {
    return this.prisma.alert.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAsResolved(id: string) {
    return this.prisma.alert.update({
      where: { id },
      data: { 
        isResolved: true,
        resolvedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.alert.delete({
      where: { id },
    });
  }
}