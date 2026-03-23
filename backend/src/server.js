import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { router } from './routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json());

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
