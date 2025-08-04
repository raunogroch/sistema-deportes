import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as Joi from "joi";

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = "admin",
  COACH = "coach",
  ATHLETE = "athlete",
  MEDIC = "medic",
  PARENT = "parent",
}

@Schema({ timestamps: true })
export class User {
  toObject() {
    throw new Error("Method not implemented.");
  }

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], enum: UserRole, default: [UserRole.ATHLETE] })
  roles: UserRole[];

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  contact: string;

  // Datos deportivos
  @Prop()
  discipline: string;

  @Prop()
  category: string;

  @Prop()
  club: string;

  @Prop()
  sportsHistory: string[];

  // Documentación
  @Prop()
  federativeLicense: string;

  @Prop()
  medicalInsurance: string;

  @Prop()
  certificates: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export const userValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  roles: Joi.array().items(Joi.string().valid(...Object.values(UserRole))),
  age: Joi.number().min(0),
  gender: Joi.string().valid("male", "female", "other"),
  contact: Joi.string(),
  discipline: Joi.string(),
  category: Joi.string(),
  club: Joi.string(),
  sportsHistory: Joi.array().items(Joi.string()),
  federativeLicense: Joi.string(),
  medicalInsurance: Joi.string(),
  certificates: Joi.array().items(Joi.string()),
});
