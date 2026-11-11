import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const router = express.Router();

// Load YAML file
const swaggerPath = path.join(__dirname, "../swagger/openapi.yaml");
const swaggerDocument = YAML.load(swaggerPath);

// Basic auth middleware for docs protection
const basicAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="API Documentation"');
    return res.status(401).json({ error: 'Authentication required' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  if (!base64Credentials) {
    return res.status(401).json({ error: 'Invalid authentication format' });
  }

  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Simple credential check - in production, use environment variables
  const DOCS_USERNAME = process.env.DOCS_USERNAME || 'admin';
  const DOCS_PASSWORD = process.env.DOCS_PASSWORD || 'password';

  if (username === DOCS_USERNAME && password === DOCS_PASSWORD) {
    return next();
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Swagger UI options (PRO setup)
const options = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true, // keeps JWT after refresh
  },
  customSiteTitle: "Auth API Docs",
};

router.use("/", basicAuth, swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

export default router;