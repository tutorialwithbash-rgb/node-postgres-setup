import { config } from "dotenv";
config({ path: new URL("../../.env", import.meta.url).pathname });

import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.Routes";
import userRoutes from "./src/routes/user.Routes";
import swaggerRoutes from "./src/routes/swagger.Route";

import { connectDB } from "./src/db/connection";
// create the application rather than a router so we can listen
const app = express();

const apiBase = "/api/v1";

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// serve swagger UI at /api/v1/docs
app.use(`${apiBase}/docs`, swaggerRoutes);
// Mount routes
app.use(`${apiBase}/auth`, authRoutes);
app.use(`${apiBase}/users`, userRoutes);

// Start the server only if this file is run directly (not imported)
if (require.main === module) {
  const port = process.env.PORT || 3001;
  connectDB()
    .then(() => {
      app.listen(port, () => {
        console.log(`Auth service running on port ${port}`);
      });
    })
    .catch((error: unknown) => {
      console.error("Database connection failed", error);
      process.exit(1);
    });
}

export default app;
