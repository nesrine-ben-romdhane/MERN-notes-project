
const asyncHandler = require("express-async-handler");
const user = require("../model/user");
const bcrypt = require('bcrypt')

const getalluser = asyncHandler(async(req,res)=>{
    const Users = await user.find().select('-password').lean()
    
    if (!Users?.length){
        return(res.status(400).json({message:'No users found'}))
    }
    res.status(200).json(Users)
})


const createNewuser = asyncHandler(async(req,res)=>{
    const {username, password,Roles}=req.body
    if (!username || !password){
        return res.status(400).json({ message: 'All fields are required' })
    }
    const duplicate = await user.findOne({username}).collation({ locale: 'en', strength: 2 }).lean().exec()
  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate user' })
  }
  const hashedPwd = await bcrypt.hash(password, 10) // salt rounds
  const userObject = { username, password:hashedPwd,Roles }
  const newUser = await user.create(userObject)
  if ( newUser) { 
    return res.status(201).json({ message: 'New user created' })
  } else {
    return res.status(400).json({ message: 'Invalid user data received' })
  }

})

const updateUser = asyncHandler(async(req,res)=>{
  const updates = Object.keys (req.body)
  const _id = req.params.id
  // const username=req.body.username
  const User = await user.findById(_id).exec()
  if (!User) {
    return res.status(400).json({ message: 'User not found' })
  }
  updates.forEach((ele) => {
    User[ele] = req.body[ele]
  })

  await User.save().then((user)=> { res.status(200).send(user)})
  .catch((e)=>{res.status(400).send(e)})   
})






const deleteUser = asyncHandler(async(req,res)=>{

 const id= req.params.id

  if (!id) {
    return res.status(400).json({ message: 'user ID required' })
  }

  const User = await user.findById(id).exec()

  if (!User) {
    return res.status(400).json({ message: 'User not found' })
  }

  await user.deleteOne().then(res.json("user deleted"))

})
module.exports = {
  getalluser,
  createNewuser,
  updateUser ,
  deleteUser
 
}