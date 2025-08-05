import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "../../users/schemas/user.schema";

export type MedicalRecordDocument = MedicalRecord & Document;

@Schema({ timestamps: true })
export class MedicalRecord {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  athlete: User;

  @Prop()
  injuries: Array<{
    date: Date;
    description: string;
    severity: string;
    recoveryTime: string;
  }>;

  @Prop([String])
  allergies: string[];

  @Prop([String])
  chronicDiseases: string[];

  @Prop()
  rehabilitation: Array<{
    date: Date;
    description: string;
    therapist: string;
    progress: string;
  }>;

  @Prop([String])
  medicalReports: string[];

  @Prop()
  vaccineReminders: Array<{
    vaccine: string;
    date: Date;
    nextDose?: Date;
    completed: boolean;
  }>;
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
