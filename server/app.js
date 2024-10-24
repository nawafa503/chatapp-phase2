import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import connectDB from './db/db.js';
import userRoutes from './routes/userRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import cors from 'cors';
import http from 'http';
import { initializeSocketIO } from './controllers/channelController.js';
// import { ExpressPeerServer } from 'peer';
import { PeerServer } from 'peer';

const app = express();
// Enable CORS for all routes
app.use(cors({origin: 'http://localhost:4200'}));
app.use('/uploads', express.static('uploads'))

//create socket io server
const socketServer = http.createServer(app);
initializeSocketIO(socketServer);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false})); 


// Routes
app.use('/auth', authRoutes);
app.use('/group', groupRoutes);
app.use('/user', userRoutes);
app.use('/channel', channelRoutes);

export {app, socketServer};
