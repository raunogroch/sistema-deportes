import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../users/schemas/user.schema";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Admin")
@ApiBearerAuth()
@Controller("admin")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Endpoints para pagos
  @Post("payments")
  @Roles(UserRole.ADMIN)
  async createPayment(@Body() createPaymentDto: any) {
    return this.adminService.createPayment(createPaymentDto);
  }

  @Get("payments")
  @Roles(UserRole.ADMIN)
  async findAllPayments() {
    return this.adminService.findAllPayments();
  }

  @Get("payments/user/:userId")
  @Roles(UserRole.ADMIN, UserRole.ATHLETE)
  async findPaymentsByUser(@Param("userId") userId: string) {
    return this.adminService.findPaymentsByUser(userId);
  }

  @Put("payments/:id")
  @Roles(UserRole.ADMIN)
  async updatePayment(@Param("id") id: string, @Body() updatePaymentDto: any) {
    return this.adminService.updatePayment(id, updatePaymentDto);
  }

  // Endpoints para patrocinios
  @Post("sponsorships")
  @Roles(UserRole.ADMIN)
  async createSponsorship(@Body() createSponsorshipDto: any) {
    return this.adminService.createSponsorship(createSponsorshipDto);
  }

  @Get("sponsorships")
  @Roles(UserRole.ADMIN, UserRole.COACH)
  async findAllSponsorships() {
    return this.adminService.findAllSponsorships();
  }

  @Get("sponsorships/athlete/:athleteId")
  @Roles(UserRole.ADMIN, UserRole.COACH, UserRole.ATHLETE)
  async findSponsorshipsByAthlete(@Param("athleteId") athleteId: string) {
    return this.adminService.findSponsorshipsByAthlete(athleteId);
  }

  @Put("sponsorships/:id")
  @Roles(UserRole.ADMIN)
  async updateSponsorship(
    @Param("id") id: string,
    @Body() updateSponsorshipDto: any
  ) {
    return this.adminService.updateSponsorship(id, updateSponsorshipDto);
  }

  // Endpoints para gestión de usuarios
  @Post("promote-to-admin/:userId")
  @Roles(UserRole.ADMIN)
  async promoteUserToAdmin(@Param("userId") userId: string) {
    return this.adminService.promoteUserToAdmin(userId);
  }
}
