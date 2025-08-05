import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { SportsModule } from "src/sports/sports.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SportsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Esto es importante para que otros módulos puedan usar el UsersService
})
export class UsersModule {}
