import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Sport, SportDocument } from "./schemas/sports.schema";

@Injectable()
export class SportsService {
  constructor(
    @InjectModel(Sport.name) private sportModel: Model<SportDocument>
  ) {}

  async create(createSportDto: any): Promise<Sport> {
    const createdSport = new this.sportModel(createSportDto);
    return createdSport.save();
  }

  async findAll(): Promise<Sport[]> {
    return this.sportModel.find().exec();
  }

  async findOne(id: string): Promise<Sport> {
    const sport = await this.sportModel.findById(id).exec();
    if (!sport) throw new NotFoundException("Sport not found");
    return sport;
  }

  async update(id: string, updateSportDto: any): Promise<Sport> {
    const sport = await this.sportModel.findByIdAndUpdate(id, updateSportDto, {
      new: true,
    });
    if (!sport) throw new NotFoundException("Sport not found");
    return sport;
  }

  async remove(id: string): Promise<void> {
    const result = await this.sportModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException("Sport not found");
  }
}
