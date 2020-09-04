import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// add more routers here
import { authRouter } from './routers';

dotenv.config({ silent: true });

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/DB_NAME';
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  loggerLevel: 'error',
  useFindAndModify: false,
};
mongoose.connect(mongoURI, mongooseOptions).then(() => {
  console.log('Connected to Database');
  console.log(mongoURI);
}).catch((err) => {
  console.log('Not Connected to Database ERROR!  ', err);
});

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// additional init stuff should go before hitting the routing

app.get('/', (_req, res) => {
  res.json({ message: 'hello world!' });
});

// ROUTING
app.use('/', authRouter);

// Custom 404 middleware
app.use((_req, res) => {
  res.status(404).json({ message: 'The route you\'ve requested doesn\'t exist' });
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
