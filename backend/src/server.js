import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './libs/db.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json());

app.use(cors());
connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
})

