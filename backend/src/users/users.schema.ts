import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: function (v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: () => `Invalid emailId!`
    }
  })
  email: string;

  @Prop({ required: true})
  password: string;

  @Prop()
  lastLogInAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
