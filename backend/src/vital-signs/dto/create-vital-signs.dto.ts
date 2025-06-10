import { IsString, IsOptional, IsInt, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVitalSignsDto {
  @ApiProperty()
  @IsString()
  patientId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  heartRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  systolicBP?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  diastolicBP?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  oxygenSaturation?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  respiratoryRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  steps?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  calories?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  sleepScore?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  stressLevel?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  hrv?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  vo2Max?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  timestamp?: string;
}