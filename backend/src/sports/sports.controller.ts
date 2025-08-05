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
import { SportsService } from "./sports.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../users/schemas/user.schema";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Sports")
@ApiBearerAuth()
@Controller("sports")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createSportDto: any) {
    return this.sportsService.create(createSportDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.sportsService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.ADMIN)
  async findOne(@Param("id") id: string) {
    return this.sportsService.findOne(id);
  }

  @Put(":id")
  @Roles(UserRole.ADMIN)
  async update(@Param("id") id: string, @Body() updateSportDto: any) {
    return this.sportsService.update(id, updateSportDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  async remove(@Param("id") id: string) {
    return this.sportsService.remove(id);
  }
}
