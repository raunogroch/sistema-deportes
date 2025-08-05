import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SportDocument = Sport & Document;

@Schema({ timestamps: true })
export class Sport {
  _id?: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;
}

export const SportSchema = SchemaFactory.createForClass(Sport);
