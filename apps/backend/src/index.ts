import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { cleanEnv, port } from 'envalid';

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const env = cleanEnv(process.env, {
  PORT: port({ default: 3001 }),
});

const PORT = env.PORT;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
