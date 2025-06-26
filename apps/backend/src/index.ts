import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import asyncHandler from './utils/asyncHandler.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3001;

app.get(
  '/health',
  asyncHandler(async (_req, res) => {
    res.json({ status: 'ok' });
  })
);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
