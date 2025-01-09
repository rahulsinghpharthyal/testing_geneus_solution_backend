import fetch from "node-fetch";
global.fetch = fetch;
import "dotenv/config";
import cors from "cors";
import express from "express";
import { readdirSync } from "fs";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url'; 
import { dirname } from 'path'; 

import connectDB from './db/Connect.js'


// Manually create __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

/*const allowedOrigins = [
  process.env.FRONTEND_URL,
];


app.use((req, res, next) => {

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    res.setHeader("Access-Control-Max-Age", 7200);
  
    next();
});*/

// Configure CORS options
const corsOptions = {
  origin: [process.env.FRONTEND_URL,process.env.FRONTEND_URL1],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE',
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Content-Type-Options',
    'Accept',
    'X-Requested-With',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204, 
  maxAge: 7200,
};

// import aj from "./utilities/ArcjectSetup/arcjetConfig.js";

// // Middleware to use Arcjet for all routes
// app.use((req, res, next) => {
//   aj.track(req)
//     .then(() => next()) // Continue to next middleware if allowed
//     .catch((err) => res.status(403).json({ error: err.message })); // Block request if violated
// });

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));


const routes = readdirSync("./routes");
routes.forEach(async (r) => {
    const routePath = `./routes/${r}`;
    const router = (await import(routePath)).default;
    app.use("/", router);
});

// Set up Morgan with a custom log format and write logs to a file
const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT,"0.0.0.0", async() =>{
  await connectDB();
  console.log(`Server is running successfully on PORT ${PORT}`)
});