const mongoose = require('mongoose');

const mainSchema = new mongoose.Schema({
	lokshaba:[],
	assembly:[],
	state:{type:String,required:true},
	isDelete:{type:Boolean,required:true,default:false},
	status:{type:Number,required:true,default:1},
})

const state = mongoose.model('State',mainSchema);
module.exports = state;