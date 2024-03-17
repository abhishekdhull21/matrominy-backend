const mongoose = require('mongoose');
const URI = process.env.MONGO_DB_URL || "mongodb://localhost:27017/matrimony"
mongoose.connect(URI).then(()=>{console.log("connected to db done...",)}).catch(err => console.error(process.env.MONGO_DB_URL,"failed to connect to db: ", err));