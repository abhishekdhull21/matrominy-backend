
module.exports = (req,res,next) =>{
    req.parameter = {...(req.params), ...(req.query), ...(req.body) };
    next();
}