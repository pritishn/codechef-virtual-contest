const mongoose = require("mongoose");

const RankSchema =  new mongoose.Schema({
  rank: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  penalty: {
    type: Number,
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
  problemScore: [
    {
      problemCode: {
        type: String,
        required: true,
      },
      bestSolutionTime: {
        type: Number,
        required: true,
      },
      penalty: {
        type: Number,
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
    }
  ]
});
const RanklistSchema =  new mongoose.Schema({
  contestCode : {
    type:String,
    required:true
  },
  ranks : [RankSchema]
});


const ContestSchema =  new mongoose.Schema({
  contestCode: {
    type: String,
    required: true,
  },
  rankingType: {
    type: Number,
    required: true,
  },
  announcements: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  problemsList: [
    {
      problemCode: {
        type: String,
        required: true,
      },
      successfulSubmissions: {
        type: Number,
        required: true,
      },
      accuracy: {
        type: Number,
        required: true,
      },
    },
  ]
});

const VirutalContestSchema =  new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  isRunning: {
    type: Boolean,
    required: true
  },
  startTime: {
    type: Date
  },
  endTime:{
    type: Date
  },
  duration : {
    type:Number
  },
  contestCode: {
    type: String,
    required: true
  },
  problemsAttempted : [{
    problemCode : String,
    penalty:Number,
    bestSolutionTime:Number
  }] 
});


module.exports =  {  
  VirtualContest :  mongoose.model("VirtualContest", VirutalContestSchema),
  Contest : mongoose.model("Contest", ContestSchema)
}