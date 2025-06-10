import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VitalSignsService } from './vital-signs.service';
import { CreateVitalSignsDto } from './dto/create-vital-signs.dto';
import { UpdateVitalSignsDto } from './dto/update-vital-signs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Vital Signs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vital-signs')
export class VitalSignsController {
  constructor(private readonly vitalSignsService: VitalSignsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new vital signs record' })
  create(@Body() createVitalSignsDto: CreateVitalSignsDto) {
    return this.vitalSignsService.create(createVitalSignsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vital signs' })
  findAll() {
    return this.vitalSignsService.findAll();
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get vital signs by patient ID' })
  findByPatient(
    @Param('patientId') patientId: string,
    @Query('limit') limit?: string,
  ) {
    return this.vitalSignsService.findByPatient(
      patientId,
      limit ? parseInt(limit) : 100,
    );
  }

  @Get('device/:deviceId')
  @ApiOperation({ summary: 'Get vital signs by device ID' })
  findByDevice(
    @Param('deviceId') deviceId: string,
    @Query('limit') limit?: string,
  ) {
    return this.vitalSignsService.findByDevice(
      deviceId,
      limit ? parseInt(limit) : 100,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vital signs by ID' })
  findOne(@Param('id') id: string) {
    return this.vitalSignsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vital signs' })
  update(
    @Param('id') id: string,
    @Body() updateVitalSignsDto: UpdateVitalSignsDto,
  ) {
    return this.vitalSignsService.update(id, updateVitalSignsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vital signs' })
  remove(@Param('id') id: string) {
    return this.vitalSignsService.remove(id);
  }
}