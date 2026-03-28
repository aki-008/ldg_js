import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import "dotenv/config";
import { checkDBConnection } from "./db"; // ← changed from initDB
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todos";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Todo API", version: "1.0.0" },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("❌ Error:", err.message);
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  },
);

// ─── Start only after DB is ready ─────────────────────────
checkDBConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server:  http://localhost:${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
  });
});
