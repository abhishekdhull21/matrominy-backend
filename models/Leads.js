const mongoose  = require("mongoose");
const commonSchema = require("./common");

const schema = new mongoose.Schema({
    type:Number,
    profileViewed:{type: mongoose.SchemaTypes.ObjectId, ref:'user'},
    userID:{type: mongoose.SchemaTypes.ObjectId, ref:'user'},
});
// leads type
// 1: Profile View

schema.add(commonSchema);

schema.statics.saveLead = function(leadData){
    const lead = new this(leadData);
    return lead.save();
}
schema.statics.getLead = function(condition){
    return this.find(condition);
}

schema.statics.findAndUpdateLead = function(userID,profileViewed){
    return this.findOneAndUpdate({userID,profileViewed},{updatedAt: new Date()},{upsert:true});
 }
 


const Lead = mongoose.model('lead', schema);

module.exports = Lead;