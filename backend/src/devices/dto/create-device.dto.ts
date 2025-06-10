import { IsString, IsEnum, IsArray, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeviceType } from '@prisma/client';

export class CreateDeviceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: DeviceType })
  @IsEnum(DeviceType)
  type: DeviceType;

  @ApiProperty()
  @IsString()
  serialNumber: string;

  @ApiProperty({ required: false, default: 100 })
  @IsOptional()
  @IsInt()
  batteryLevel?: number;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isConnected?: boolean;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  capabilities: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  patientId?: string;
}