import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { PerformanceService } from "./performance.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../users/schemas/user.schema";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Performance")
@ApiBearerAuth()
@Controller("performance")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Post()
  @Roles(UserRole.COACH, UserRole.ADMIN)
  async create(@Body() createPerformanceDto: any) {
    return this.performanceService.create(createPerformanceDto);
  }

  @Get("athlete/:id")
  @Roles(UserRole.ADMIN, UserRole.COACH, UserRole.ATHLETE)
  async findByAthlete(@Param("id") id: string) {
    return this.performanceService.findByAthlete(id);
  }

  @Put(":id")
  @Roles(UserRole.COACH, UserRole.ADMIN)
  async update(@Param("id") id: string, @Body() updatePerformanceDto: any) {
    return this.performanceService.update(id, updatePerformanceDto);
  }
}
