import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Performance, PerformanceSchema } from "./schemas/performance.schema";
import { PerformanceService } from "./performance.service";
import { PerformanceController } from "./performance.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Performance.name, schema: PerformanceSchema },
    ]),
  ],
  controllers: [PerformanceController],
  providers: [PerformanceService],
  exports: [PerformanceService],
})
export class PerformanceModule {}
