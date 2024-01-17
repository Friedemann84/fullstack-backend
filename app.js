import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import morgan from 'morgan';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import userRouter from './routes/users.js'
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT;
const URI = 'mongodb://localhost:27017/cookie-fullstack';
const app = express();

mongoose.connect(URI)
  .then(() => console.log('Mit mongoDB verbunden....'))
  .catch((err) => console.log(err));

mongoose.connection.on('error', (err) => console.log(err));

app.use(morgan('dev'));
app.use(express.json());
// wenn Cookies mitgeschickt werden, muss Pfad bestimmt werden, von dem Cookies angenommen werden
app.use(cors({
  origin: process.env.CLIENT || 'http://localhost:5174',
  credentials: true
}));

// wo Session-Daten gespeichert werden
const store = MongoStore.create({client: mongoose.connection.getClient()});

// notwendig, damit express-sessión auf render.com funzt
app.set('trust proxy', 1);

// jede Anfrage bekommt eine Session-Eigenschaft
app.use(session({
  name: "auth-demo-cookie",
  secret: "aslklkjrlkjdvlkjd",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,   // 1 Tag in Millisekunden
    httpOnly: true, // browser-js hat kein Zugriff auf diesen Cookie
    // für render.com
    secure: app.get('env') === 'production', // process.env.NODE_ENV === 'production
    sameSite: app.get('env') === 'production' ? 'None' : 'Lax'
  }
}));


// routes
app.use('/users', userRouter);

//404
app.use((req,res, next) => {
  const error = new Error('404 - Pfad nicht gefunden');
  error.status = 404;
  next(error);    // next() ohne Argument geht einfach zur nächsten Middleware
})

//errorHandler
app.use(errorHandler)



app.listen(PORT, () => console.log(`Server jumps around on PORT: ${PORT}`));
