// archivo: src/tools/db-test.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Injectable()
export class DbTestService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    try {
      // Versión con optional chaining
      const pingResult = await this.connection?.db?.admin()?.ping();

      if (!pingResult) {
        throw new Error("No se pudo conectar a MongoDB");
      }

      console.log("✅ Conexión a MongoDB establecida correctamente");
      console.log(
        `📊 Base de datos: ${
          this.connection?.db?.databaseName || "no identificada"
        }`
      );
      console.log(`🛠 Estado: ${this.connection?.readyState}`);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  }
}
