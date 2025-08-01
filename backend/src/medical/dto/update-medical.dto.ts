import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional } from "class-validator";

export class UpdateMedicalDto {
  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  injuries?: Array<{
    date: Date;
    description: string;
    severity: string;
    recoveryTime: string;
  }>;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  allergies?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  chronicDiseases?: string[];
}
