import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Payment,
  PaymentDocument,
  PaymentType,
  PaymentStatus,
} from "./schemas/payment.schema";
import {
  Sponsorship,
  SponsorshipDocument,
  SponsorshipStatus,
} from "./schemas/sponsorship.schema";
import { UserRole } from "../users/schemas/user.schema";
import { UsersService } from "../users/users.service";
import * as Joi from "joi";

const paymentValidationSchema = Joi.object({
  user: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  description: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(PaymentType))
    .required(),
  status: Joi.string().valid(...Object.values(PaymentStatus)),
  dueDate: Joi.date().required(),
  paymentDate: Joi.date(),
  transactionId: Joi.string(),
});

const sponsorshipValidationSchema = Joi.object({
  athlete: Joi.string().required(),
  sponsorName: Joi.string().required(),
  sponsorLogo: Joi.string(),
  amount: Joi.number().min(0).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required().greater(Joi.ref("startDate")),
  status: Joi.string().valid(...Object.values(SponsorshipStatus)),
  terms: Joi.string(),
  benefits: Joi.array().items(Joi.string()),
});

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Sponsorship.name)
    private sponsorshipModel: Model<SponsorshipDocument>,
    private usersService: UsersService
  ) {}

  // Métodos para pagos
  async createPayment(createPaymentDto: any): Promise<Payment> {
    const validatedData = await paymentValidationSchema.validateAsync(
      createPaymentDto
    );
    const createdPayment = new this.paymentModel(validatedData);
    return createdPayment.save();
  }

  async findAllPayments(): Promise<Payment[]> {
    return this.paymentModel.find().populate("user").exec();
  }

  async findPaymentsByUser(userId: string): Promise<Payment[]> {
    return this.paymentModel.find({ user: userId }).populate("user").exec();
  }

  async updatePayment(id: string, updatePaymentDto: any): Promise<Payment> {
    const validatedData = await paymentValidationSchema.validateAsync(
      updatePaymentDto
    );
    const updatedPayment = await this.paymentModel
      .findByIdAndUpdate(id, validatedData, { new: true })
      .exec();

    if (!updatedPayment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return updatedPayment;
  }

  // Métodos para patrocinios
  async createSponsorship(createSponsorshipDto: any): Promise<Sponsorship> {
    const validatedData = await sponsorshipValidationSchema.validateAsync(
      createSponsorshipDto
    );
    const createdSponsorship = new this.sponsorshipModel(validatedData);
    return createdSponsorship.save();
  }

  async findAllSponsorships(): Promise<Sponsorship[]> {
    return this.sponsorshipModel.find().populate("athlete").exec();
  }

  async findSponsorshipsByAthlete(athleteId: string): Promise<Sponsorship[]> {
    return this.sponsorshipModel
      .find({ athlete: athleteId })
      .populate("athlete")
      .exec();
  }

  async updateSponsorship(
    id: string,
    updateSponsorshipDto: any
  ): Promise<Sponsorship> {
    const validatedData = await sponsorshipValidationSchema.validateAsync(
      updateSponsorshipDto
    );

    const updatedSponsorship = await this.sponsorshipModel
      .findByIdAndUpdate(id, validatedData, { new: true })
      .exec();

    if (!updatedSponsorship) {
      throw new NotFoundException(`Sponsorship with ID ${id} not found`);
    }

    return updatedSponsorship;
  }

  // Métodos para gestión de usuarios (delegados al UsersService)
  async promoteUserToAdmin(userId: string): Promise<any> {
    const user = await this.usersService.findOne(userId);
    if (!user.roles.includes(UserRole.ADMIN)) {
      // Usar UserRole.ADMIN en lugar de "admin"
      user.roles.push(UserRole.ADMIN); // Usar el enum aquí también
      return this.usersService.update(userId, user);
    }
    return user;
  }
}
