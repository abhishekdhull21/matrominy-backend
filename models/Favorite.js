const mongoose  = require("mongoose");
const commonSchema = require("./common");

const schema = new mongoose.Schema({
    isFavorite:{type: "boolean", default:true},
    favoriteProfile:{type: mongoose.SchemaTypes.ObjectId, ref:'user'},
    userID:{type: mongoose.SchemaTypes.ObjectId, ref:'user'},
});

schema.add(commonSchema);

schema.statics.favoriteProfile = function(userID,favoriteProfile, favorite){
   return this.findOneAndUpdate({userID,favoriteProfile},{isFavorite:favorite, updatedAt: new Date()},{upsert:true});
}

schema.statics.getAll = function(condition){
   return this.find(condition).populate({path:'favoriteProfile',select:'name last username images bio isSingle gender '});

}



const Favorite = mongoose.model('favorites', schema);

module.exports = Favorite;