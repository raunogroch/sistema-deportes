import { Controller, Get, Post, Body, Param, Put } from "@nestjs/common";
import { MedicalService } from "./medical.service";
import { CreateMedicalDto } from "./dto/create-medical.dto";
import { UpdateMedicalDto } from "./dto/update-medical.dto";

@Controller("medical")
export class MedicalController {
  constructor(private readonly medicalService: MedicalService) {}

  @Post()
  create(@Body() createMedicalDto: CreateMedicalDto) {
    return this.medicalService.create(createMedicalDto);
  }

  @Get("athlete/:id")
  findByAthlete(@Param("id") id: string) {
    return this.medicalService.findByAthlete(id);
  }

  @Put("athlete/:id")
  update(@Param("id") id: string, @Body() updateMedicalDto: UpdateMedicalDto) {
    return this.medicalService.update(id, updateMedicalDto);
  }
}
