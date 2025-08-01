import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { PerformanceModule } from "./performance/performance.module";
import { MedicalModule } from "./medical/medical.module";
import { AdminModule } from "./admin/admin.module";
import databaseConfig from "./config/database.config";
import { JwtModule } from "@nestjs/jwt";
import { DbTestService } from "./tools/db-test.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env", // Asegura que carga las variables del archivo .env
      load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>("database.uri"),
        retryAttempts: 3, // Intentos de reconexión
        retryDelay: 1000, // 1 segundo entre intentos
      }),
      inject: [ConfigService],
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "24h" },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PerformanceModule,
    MedicalModule,
    AdminModule,
  ],
  providers: [DbTestService],
})
export class AppModule {}
