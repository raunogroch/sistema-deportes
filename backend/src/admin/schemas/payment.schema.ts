import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import * as Joi from "joi";
import { User } from "../../users/schemas/user.schema";

export type PaymentDocument = Payment & Document;

export enum PaymentType {
  MEMBERSHIP = "membership",
  COMPETITION = "competition",
  EQUIPMENT = "equipment",
  OTHER = "other",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: User;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, enum: PaymentType, required: true })
  type: PaymentType;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ required: true })
  dueDate: Date;

  @Prop()
  paymentDate?: Date;

  @Prop()
  transactionId?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

export const paymentValidationSchema = Joi.object({
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
