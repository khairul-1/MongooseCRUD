import app from './app';
import config from './app/config';
import mongoose from 'mongoose';

//const mongoose = require("mongoose");

const port = 3000;

async function server() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('connected to mongoDB');
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
      //console.log(`${parseInt(config.port)}`);
    });
  } catch (error) {
    console.log(error);
  }
}

server().catch((error) => console.log(error));
