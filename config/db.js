const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URL).then(()=>{console.log("connected to db done...",)}).catch(err => console.error(process.env.MONGO_DB_URL,"failed to connect to db: ", err));