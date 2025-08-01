import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateMedicalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  athlete: string;

  @ApiProperty()
  @IsArray()
  injuries?: Array<{
    date: Date;
    description: string;
    severity: string;
    recoveryTime: string;
  }>;

  @ApiProperty()
  @IsArray()
  allergies?: string[];

  @ApiProperty()
  @IsArray()
  chronicDiseases?: string[];
}
