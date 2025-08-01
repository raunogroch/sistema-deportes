import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PerformanceDocument = Performance & Document;

@Schema({ timestamps: true })
export class Performance {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  athlete: Types.ObjectId;

  @Prop()
  weight: number;

  @Prop()
  height: number;

  @Prop()
  bodyFatPercentage: number;

  @Prop()
  vo2max: number;

  @Prop({
    type: Map,
    of: String, // Tipo de los valores del Map
    default: {}, // Valor por defecto
  })
  personalRecords: Map<string, string>; // Cambiar a Map

  @Prop([String])
  trainingRoutines: string[];

  @Prop([
    {
      date: { type: Date, required: true },
      event: { type: String, required: true },
      location: { type: String, required: true },
    },
  ])
  competitionCalendar: Array<{
    date: Date;
    event: string;
    location: string;
  }>;
}

export const PerformanceSchema = SchemaFactory.createForClass(Performance);
