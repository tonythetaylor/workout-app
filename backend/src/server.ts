import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the CORS middleware
import { errorHandler } from './middlewares/errorMiddleware';

import userRoutes from './routes/userRoutes';
import metricsRoutes from './routes/metricsRoutes';
import settingsRoutes from './routes/settingsRoutes';
import goalRoutes from './routes/goalRoutes';

dotenv.config();

const app = express();

app.use(errorHandler);

// Enable CORS
app.use(
  cors()
);

// Body parser middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/goals', goalRoutes);


const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
