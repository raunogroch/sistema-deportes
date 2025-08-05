import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import * as Joi from "joi";
import { User } from "../../users/schemas/user.schema";

export type SponsorshipDocument = Sponsorship & Document;

export enum SponsorshipStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
}

@Schema({ timestamps: true })
export class Sponsorship {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  athlete: User;

  @Prop({ required: true })
  sponsorName: string;

  @Prop()
  sponsorLogo?: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    type: String,
    enum: SponsorshipStatus,
    default: SponsorshipStatus.ACTIVE,
  })
  status: SponsorshipStatus;

  @Prop()
  terms: string;

  @Prop()
  benefits: string[];
}

export const SponsorshipSchema = SchemaFactory.createForClass(Sponsorship);

export const sponsorshipValidationSchema = Joi.object({
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
