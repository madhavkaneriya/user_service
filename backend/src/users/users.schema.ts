import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    required: true,
    validate: {
      validator: function (v: string) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      },
      message: () => `Invalid password format!`
    }
  })
  password: string;

  @Prop()
  lastLogInAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
