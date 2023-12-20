const { id } = require("date-fns/locale")
const noteModel= require("../model/Note")
const User = require ("../model/user")
const asyncHandler = require("express-async-handler")
exports.createNote=asyncHandler(async(req,res)=>{
    const { user, title, Text } = req.body

  if (!user || !title || !Text) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const duplicate = await noteModel.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
  if (duplicate !== null) {
    return res.status(409).json({ message: 'Duplicate note title' })
  }

  const noteObject = { user, title, Text }
  const newNote = await noteModel.create(noteObject)

  console.log(newNote)

  if (newNote) { // Created
    return res.status(201).json({ message: 'New note created' })
  } else {
    return res.status(400).json({ message: 'Invalid note data received' })
  }
  //.lean bech reponse tna7ilna menou l 7ajet zeyda w traja3 l7ajet li 7achetna biha
    //promis bech ythabtelna kif yet3ada 3la note kol w kif kol chy mrigul yraj3elna
    // kif nesta3mlou await nesta3mlou .exect 5atr chiraj3elna promis
})

exports.allNotes=asyncHandler(async(req,res)=>{
    const notes = await noteModel.find().lean()
  
    if (!notes?.length) {
      return res.status(400).json({ message: 'No notes found' })
    }
  
    const noteUser = await Promise.all(notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec()
      return  { ...note,user } 
    }))
  
    res.json(noteUser)

})



exports.updateNote= asyncHandler(async(req,res)=>{
  const { id,user, title, text, completed } = req.body
  

  // if (!id || !user || !title || !text || typeof completed !== 'boolean') {
  //   return res.status(400).json({ message: 'All fields are required ok' })
  // }

  const note = await noteModel.findById(id).exec()

  if (!note) {
    return res.status(400).json({ message: 'Note not found' })
  }

  const duplicate = await noteModel.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate note title' })
  }

  note.user = user
  note.title = title
  note.Text = text
  note.completed = completed

  const updatedNote = await note.save()

  res.json(`'${updatedNote.title}' updated`)   
})

exports.deleteNote = asyncHandler(async(req,res)=>{
        const _id = req.params.id;
        console.log("id req.body.id",req.body.id)
        const note = await noteModel.findById(_id).exec()
        if (!note) {
            return res.status(400).json({ message: 'Note not found oh' })
          }
        
          const result = await note.deleteOne()
          const reply = `Note '${result.title}' with ID ${result._id} deleted`

          res.json(reply)
})
