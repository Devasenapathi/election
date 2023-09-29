const express = require("express");
const router = express.Router();
const fs = require("fs");
const csv = require("csv-parser");
const Election = require('../models/main.model')
// const Lokshaba = require('../models/state.model')
const State = require("../models/state.model");
const moment = require('moment')


router.get('/delete', async function (req, res) {
	try {
		console.log("aaaaaaaaaaaaaaaaaaaaa")
		var date = moment()
		console.log(date)
		// var ress = await Election.deleteMany({ state: "TELANGANA" })
		res.send(date)
	} catch {

	}
})

router.get("/main", function (req, res) {
	//   var array = ['Andhra Pradesh.csv','Arunachal Pradesh.csv','Assam.csv','Bihar.csv','Chandigarh.csv','Chattisgarh.csv','Delhi.csv','Goa.csv','Gujarath.csv','Haryana.csv','Himachal Pradesh.csv','Jammu and Kashmir.csv','jharkhand.csv','Karnataka.csv','Kerala.csv','Madhya Pradesh.csv','Maharashtra.csv','Manipur.csv','Meghalaya.csv','Mizoram.csv','Nagaland.csv','Odisha.csv','Puducherry.csv','Punjab.csv','Rajasthan.csv','Sikkim.csv','TamilNadu.csv','Telangana.csv','Tripura.csv','Uttarkhand.csv','UttarPradesh.csv','WestBengal.csv']
	const results = [];

	//for( const arr of array){
	fs.createReadStream("C:/electionweb/server/Election_dataset/WestBengal.csv") // Replace 'data.csv' with your CSV file's path
		.pipe(csv())
		.on("data", (data) => {
			results.push(data);
		})
		.on("end", async () => {
			for (let i = 0; i < results.length; i++) {
				var query = { state: results[i]['State'].toUpperCase() }
				var result1 = await State.findOne(query)

				let electionIdKey = Object.keys(results[i]).find(key => key.trim() === 'Election_Id');
				let electionIdValue = results[i][electionIdKey];
				let dateParts = results[i]['Year'].split("-");
				let year = parseInt(dateParts[2]);

				if (electionIdValue == 'L') {
					if (result1) {
						var con = result1.lokshaba.indexOf(results[i]['Constituency'].toUpperCase())
						if (con >= 0) {

						} else {
							var doc = await State.updateOne(query, {
								$push: {
									lokshaba: results[i]['Constituency'].toUpperCase()
								}
							})
						}
					} else {
						var datas = new State({
							state: results[i]['State'].toUpperCase(),
							lokshaba: results[i]['Constituency'].toUpperCase()
						})
						let data2 = await datas.save()
					}

				} else {
					if (result1) {
						var con = result1.assembly.indexOf(results[i]['Constituency'].toUpperCase())
						if (con >= 0) {

						} else {
							var doc = await State.updateOne(query, {
								$push: {
									assembly: results[i]['Constituency'].toUpperCase()
								}
							})
						}
					} else {
						var datas = new State({
							state: results[i]['State'].toUpperCase(),
							assembly: results[i]['Constituency'].toUpperCase()
						})
						let data2 = await datas.save()
					}
				}

				let data = new Election({
					electionId: electionIdValue,
					electionType: results[i]['Election_Type'],
					constituency: results[i]['Constituency'].toUpperCase(),
					candidateName: results[i]['Candidate_Name'].toUpperCase(),
					gender: results[i]['Gender'].toUpperCase(),
					age: results[i]['Age'],
					caste: results[i]['Caste'].toUpperCase(),
					party: results[i]['Party'].toUpperCase(),
					partyName: results[i]['Party_Name'].toUpperCase(),
					symbol: results[i]['Symbol'].toUpperCase(),
					totalVotes: results[i]['Total_Votes'],
					percentageVotes: results[i]['Percentage_Votes'],
					state: results[i]['State'].toUpperCase(),
					year: year,
					result: results[i]['Result'],
					margin: results[i]['Margin'],

				})
				let data1 = await data.save()
				//Election.insertMany(data)
			}
		});
	//}
	res.send("Inserted Successfully")
});

router.get('/getDetails', async function (req, res) {
	try {
		const data = await Election.find({ "electionId": req.query.electionId, "state": req.query.state, "constituency": req.query.constituency })
		res.send(data)

	} catch {

	}
})

router.get('/getState', async function (req, res) {
	try {
		var data = await State.find({}).sort("state");
		res.send(data)

	} catch {

	}
});


router.get('/getStateDetail', async function (req, res) {
	try {
		var data = await Election.find({ "state": req.query.selectedState });
		res.send(data)

	} catch {

	}
});

router.get('/getCandidate', async function (req, res) {
	try {
		const keyword = req.query.candidate.toUpperCase(); // Replace with your keyword
		const regex = new RegExp(keyword, "i"); // "i" for case-insensitive search
		const data = await Election.find(
			{ "state": req.query.state, "candidateName": {$regex:regex}, }  // Replace "name" with the actual field name in your collection
		)
		res.send(data)
	} catch {

	}
})

router.get('/getParty',async function(req,res){
	try{
		const data = await Election.find({state:req.query.state})
		res.send(data)
	}catch{}
})


router.get('/getTotalVotes', async function (req, res) {
	try {
		var arr = []
		const data = await Election.find({ "electionId": req.query.electionId, "state": req.query.state, "constituency": req.query.constituency, "year": req.query.year })
		const datas = data.forEach(v => {
			const index = arr.findIndex(i => i.party === v.party)
			if (index == -1) {
				arr.push({
					party: v.party,
					votes: v.totalVotes
				})
			} else {
				arr[index].votes = parseInt(arr[index].votes) + parseInt(v.totalVotes)
			}
		})
		if (arr.length > 3) {
			const top8Parties = arr.sort((a, b) => b.votes - a.votes).slice(0, 4);
			// const remainingVotes = arr.sort((a, b) => b.votes - a.votes).slice(10).reduce((votes, party) => votes + parseInt(party.votes), 0);
			// const top9Parties = [
			// 	...top8Parties,
			// ];
			res.send(top8Parties)
		} else {
			res.send(arr.sort((a, b) => b.votes - a.votes))
		}
	} catch {

	}
})


router.get('/getPartyDomination',async function(req,res){
	try{
		var arr = []
		var data =await Election.find({"electionId":"L","state":"TAMIL NADU","year":"2019"})
		const datas = data.forEach(v => {
			const index = arr.findIndex(i => i.party === v.party)
			if (index == -1) {
				arr.push({
					party: v.party,
					votes: v.totalVotes
				})
			} else {
				arr[index].votes = parseInt(arr[index].votes) + parseInt(v.totalVotes)
			}
		})
		const top8Parties = arr.sort((a, b) => b.votes - a.votes).slice(0, 3);
		console.log(top8Parties,'aaaaaaaaaaaaaa')
		res.send(top8Parties)
	}catch{

	}
})

module.exports = router;
