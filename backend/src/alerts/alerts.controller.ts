import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new alert' })
  create(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.create(createAlertDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all alerts' })
  findAll() {
    return this.alertsService.findAll();
  }

  @Get('unresolved')
  @ApiOperation({ summary: 'Get unresolved alerts' })
  findUnresolved() {
    return this.alertsService.findUnresolved();
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get alerts by patient ID' })
  findByPatient(@Param('patientId') patientId: string) {
    return this.alertsService.findByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get alert by ID' })
  findOne(@Param('id') id: string) {
    return this.alertsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update alert' })
  update(@Param('id') id: string, @Body() updateAlertDto: UpdateAlertDto) {
    return this.alertsService.update(id, updateAlertDto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark alert as read' })
  markAsRead(@Param('id') id: string) {
    return this.alertsService.markAsRead(id);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Mark alert as resolved' })
  markAsResolved(@Param('id') id: string) {
    return this.alertsService.markAsResolved(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete alert' })
  remove(@Param('id') id: string) {
    return this.alertsService.remove(id);
  }
}