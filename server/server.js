import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import basicRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.js";
import repositoryRoutes from './routes/repository.js'; // Added for GitHub repository search
import { authenticateWithToken } from './routes/middleware/auth.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: DATABASE_URL or SESSION_SECRET variables in .env missing.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;
// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Authentication routes
app.use(authenticateWithToken);
app.use(authRoutes);

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

// Session configuration with connect-mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  }),
);

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Basic Routes
app.use(basicRoutes);
// Authentication Routes
app.use('/api/auth', authRoutes);

// Repository Routes - Added for GitHub repository search and build
app.use('/api/repositories', repositoryRoutes);

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

export { io };

io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});