import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SportsService } from "./sports.service";
import { SportsController } from "./sports.controller";
import { Sport, SportSchema } from "./schemas/sports.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sport.name, schema: SportSchema }]),
  ],
  controllers: [SportsController],
  providers: [SportsService],
  exports: [SportsService],
})
export class SportsModule {}
