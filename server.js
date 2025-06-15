import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mpesaRoutes from './routes/mpesa.js';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use('/api/mpesa', mpesaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
