import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Performance, PerformanceDocument } from "./schemas/performance.schema";

@Injectable()
export class PerformanceService {
  constructor(
    @InjectModel(Performance.name)
    private performanceModel: Model<PerformanceDocument>
  ) {}

  async create(createPerformanceDto: any): Promise<Performance> {
    try {
      const createdPerformance = new this.performanceModel(
        createPerformanceDto
      );
      return await createdPerformance.save();
    } catch (error) {
      throw new Error(`Error creating performance: ${error.message}`);
    }
  }

  async findByAthlete(athleteId: string): Promise<Performance[]> {
    if (!Types.ObjectId.isValid(athleteId)) {
      throw new NotFoundException("Invalid athlete ID");
    }
    return this.performanceModel
      .find({ athlete: new Types.ObjectId(athleteId) })
      .exec();
  }

  async update(id: string, updatePerformanceDto: any): Promise<Performance> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid performance ID");
    }

    const updatedPerformance = await this.performanceModel
      .findByIdAndUpdate(id, updatePerformanceDto, { new: true })
      .exec();

    if (!updatedPerformance) {
      throw new NotFoundException(`Performance with ID ${id} not found`);
    }

    return updatedPerformance;
  }
}
