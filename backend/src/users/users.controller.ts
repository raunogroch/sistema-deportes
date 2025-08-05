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
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "./schemas/user.schema";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.COACH)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.COACH, UserRole.MEDIC)
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Put(":id")
  @Roles(UserRole.ADMIN)
  async update(@Param("id") id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  async remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
