const mongoose=require('mongoose')
const connectionDB=async ()=>{
    try{
        await(
            mongoose.set('strictQuery', true),
            mongoose.connect(process.env.DATABASE_URL))
    }catch(err){
        console.log(err)
    }
}
module.exports=connectionDB