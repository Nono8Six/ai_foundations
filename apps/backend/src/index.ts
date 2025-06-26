// Imports de modules externes
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { cleanEnv, port, str } from 'envalid'; // On combine les imports

// Imports locaux (structure et bonnes pratiques)
import asyncHandler from './utils/asyncHandler.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

// --- 1. Validation des variables d'environnement ---
// On centralise la validation dès le démarrage de l'app.
// Si une variable manque ou est incorrecte, l'application plantera immédiatement,
// ce qui est le comportement souhaité ("fail-fast").
const env = cleanEnv(process.env, {
  PORT: port({ default: 3001, desc: 'The port the server will run on' }),
  NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' })
});

// --- 2. Initialisation de l'application Express ---
const app = express();

// --- 3. Middlewares ---
// Middlewares de sécurité et de base
app.use(cors()); // Gère les Cross-Origin Resource Sharing
app.use(helmet()); // Sécurise l'application en définissant divers en-têtes HTTP

// Middleware de logging des requêtes HTTP.
// En production, on préfèrera 'combined' ou un format JSON.
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Middlewares pour parser le corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- 4. Routes ---
// Route de "health check" pour vérifier que le service est en ligne.
// On utilise asyncHandler pour ne pas avoir à écrire de bloc try/catch.
app.get(
  '/health',
  asyncHandler(async (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'Service is healthy' });
  })
);

// ... vos autres routes viendraient ici ...


// --- 5. Gestion des erreurs ---
// Ce middleware doit être le DERNIER middleware à être ajouté.
// Il attrapera toutes les erreurs passées via next(error).
app.use(errorHandler);


// --- 6. Démarrage du serveur ---
const PORT = env.PORT;

app.listen(PORT, () => {
  // On utilise le logger structuré pour une meilleure observabilité.
  logger.info(`Server listening on port ${PORT} in ${env.NODE_ENV} mode.`);
});