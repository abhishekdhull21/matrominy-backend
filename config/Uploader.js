const multer = require("multer");
const fs = require("fs");

const storageEngine = multer.diskStorage({
    destination: (req,file,cb) =>{
      const filePath = `multimedia/ad/${req.user._id}/`;
      fs.mkdirSync(filePath, { recursive: true });

      console.log(String(req?.user?._id));
       cb(null,filePath)
      },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}--${file.originalname}`);
    },
  });
  //initializing multer
module.exports.upload = multer({
    storage: storageEngine,
  });