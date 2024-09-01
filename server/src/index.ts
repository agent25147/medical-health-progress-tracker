import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import setupOAuth from './oauth_setup';
const cors = require('cors');
import { AppDataSource } from './db_config';
import router from './routes/log.controller';
import { initSocketManager } from './sockets_setup';

function startServer() {
    try {

        dotenv.config();

        const app = express();
        const server = createServer(app);

        initSocketManager(server);

        app.use(express.json());
        app.use(express.urlencoded({extended: true}));

        AppDataSource.initialize()
        .then(r => {
            console.log('db connected!');
        })
        .catch(e => {
            console.log('db failed!');
            process.exit(1);
        });

       // Enable CORS
        app.use(cors({
            origin: process.env.CLIENT_APP_URL,
            credentials: true
        }));

        setupOAuth(app);

        app.use('', router);

        const port: string | number = 5000;
        server.listen(port, () => {
            console.log("Server running successfully at port ", port);
            console.log(`browse: http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("From startServer function:");
        console.dir(error, { depth: 20 });
    }

}

startServer();
