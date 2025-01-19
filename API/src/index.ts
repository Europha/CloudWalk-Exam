import express, { Application } from 'express';
import { appRoutes } from './routes/routes';
import cors from 'cors'; // To enable CORS

const app: Application = express();
const port = 3000;

// Enable CORS for the frontend application running on localhost:3001
app.use(cors({
    origin: 'http://localhost:5173',  // Adjust according to your frontend's URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON body (replacing body-parser)
app.use(express.json());  // Express built-in JSON parser

// Use routes
appRoutes(app);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
