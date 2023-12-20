const mongoose = require ('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
noteSchema = new mongoose.Schema({
    title : {
        type : String ,
        required : true ,
        trim:true ,
        unique: true,
    },
    Text : {
        type:String,
        required:true,
        trim:true
    },
    completed: {
        type : Boolean,
        default : false

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
    
},
{
    // fi3oudh chna3mlou l create at w apdatet att timestamps ya3malhm par defaut
    timestamps:true
}
)

// bech yebda l id ta3 note b 500
noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id :'ticketNums',
    start_seq: 500,
  });
 
module.exports = mongoose.model("note", noteSchema )