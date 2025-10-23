import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();
const PORT: number = 3001;

// Enable CORS to allow communication from the frontend
app.use(cors());

// A simple API endpoint
app.get('/api/message', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
