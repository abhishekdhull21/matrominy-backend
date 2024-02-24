const errorHandler = (err, req, res, next) => {
    console.log("error",err);

    const errorResponse = {success:false,isValid:err.isValid, error:err.error}
    if ( err.code === 11000) {
    res.status(400).json({...errorResponse, message: 'Mobile already registered' });
    }
    else if ( err.status){
      res.status(err.status).json({...errorResponse, message:err.message });  
    }
    else {
      console.error(err.stack);
      res.status(500).json({...errorResponse, message: 'Internal server error' });
    }
  };

  module.exports = errorHandler;