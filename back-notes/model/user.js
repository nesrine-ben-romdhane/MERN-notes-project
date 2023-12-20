const mongoose = require ('mongoose')
const userSchema = new mongoose.Schema({
    username : {
        type: String , 
        trim : true ,
        required : true,
        unique: true,
    },
    password : {
        type : String ,
        required : true ,
        trim : true ,
        minlength : 8 ,
        validate(value){
            let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if(!password.test(value)){
                throw new Error("Password must include uppercase , lowercase , numbers , speacial characters")
            }
        }
    },
    active : {
        type : Boolean ,
        default:true,
    },
    Roles : {
        type : [String ],
        default: ['Employee']
    },
    tokens : [
        {
            type: String,
            required : true
        }
    ]
})
module.exports = mongoose.model( 'User' , userSchema  )


