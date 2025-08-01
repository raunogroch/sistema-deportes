import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MedicalRecord, MedicalRecordDocument } from "./schemas/medical.schema";
import { CreateMedicalDto } from "./dto/create-medical.dto";
import { UpdateMedicalDto } from "./dto/update-medical.dto";

@Injectable()
export class MedicalService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private medicalModel: Model<MedicalRecordDocument>
  ) {}

  async create(createMedicalDto: CreateMedicalDto): Promise<MedicalRecord> {
    const createdRecord = new this.medicalModel(createMedicalDto);
    return createdRecord.save();
  }

  async findByAthlete(athleteId: string): Promise<MedicalRecord> {
    if (!Types.ObjectId.isValid(athleteId)) {
      throw new NotFoundException("Invalid athlete ID");
    }

    const record = await this.medicalModel
      .findOne({ athlete: new Types.ObjectId(athleteId) })
      .exec();

    if (!record) {
      throw new NotFoundException(
        `Medical record for athlete ${athleteId} not found`
      );
    }

    return record;
  }

  async update(
    athleteId: string,
    updateMedicalDto: UpdateMedicalDto
  ): Promise<MedicalRecord> {
    if (!Types.ObjectId.isValid(athleteId)) {
      throw new NotFoundException("Invalid athlete ID");
    }

    const updatedRecord = await this.medicalModel
      .findOneAndUpdate(
        { athlete: new Types.ObjectId(athleteId) },
        updateMedicalDto,
        { new: true }
      )
      .exec();

    if (!updatedRecord) {
      throw new NotFoundException(
        `Medical record for athlete ${athleteId} not found`
      );
    }

    return updatedRecord;
  }
}
