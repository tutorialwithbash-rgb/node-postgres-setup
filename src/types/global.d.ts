// types/express.d.ts or global.d.ts (recommended name: express.d.ts)

import type { JwtPayload } from "jsonwebtoken";

export interface AuthUser extends JwtPayload {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: "rider" | "driver" | "admin";
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

