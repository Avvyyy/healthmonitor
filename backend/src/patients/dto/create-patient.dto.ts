import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, PatientStatus } from '@prisma/client';

export class CreatePatientDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsString()
  room: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiProperty({ enum: PatientStatus, required: false })
  @IsOptional()
  @IsEnum(PatientStatus)
  status?: PatientStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}