const mongoose = require('mongoose');

const mainSchema = new mongoose.Schema({
	electionId:{type:String,required:true},
	electionType:{type:String,required:true},
	constituency:{type:String,required:true},
	candidateName:{type:String,required:true},
	gender:{type:String,required:true},
	age:{type:String,required:true,},
	caste:{type:String,required:true},
	party:{type:String,required:true},
	partyName:{type:String,required:true},
	symbol:{type:String,required:true},
	totalVotes:{type:String,required:true},
	percentageVotes:{type:String,required:true},
	state:{type:String,required:true},
	year:{type:String,required:true},
	result:{type:String,required:true},
	margin:{type:String,required:true},
	isDelete:{type:Boolean,required:true,default:false},
	status:{type:Number,required:true,default:1},
})

const election = mongoose.model('Election',mainSchema);
module.exports = election;