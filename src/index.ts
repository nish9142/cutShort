import app from './app';
import mongoose from "mongoose";
const isProd = process.env.ENV == 'production';
const MONGO_URI = process.env.MONGO_URI 
mongoose.connect(MONGO_URI, { dbName:"CutShort" })
  .then(() => console.log("Connected to database"))
  .then(() => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log('Listening on port', port);
    });
  })
  .catch((err) => console.error(err));
