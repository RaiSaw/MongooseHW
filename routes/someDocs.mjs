import { Router } from "express";
import { Sample } from "../mongoose/mong.mjs"

const router = Router();
router
.get("/sample", async(req, res) => {
    try {
        const data = await Sample.find()
        res.json(data)
    }
    catch (error){
        res.status(500).json({message: error.message})
    }

})

.get("/sample/:id", async(req, res) => {
    try {
         const data = await Sample.findById(req.params.id)
         res.json(data)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

.post("/sample", (req, res) => {
    const data = new Sample({
        username: req.body.username,
        age: req.body.age,
        email: req.body.email
    })
    try {
        const saveData = data.save()
        res.status(200).json(`Giddy-up! ${data.username} is now a Pony rockstar 🦄`)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

.patch("/sample/:id", async (req, res) => {
    try{
        const id = req.params.id
        const upData = req.body
        const options = { new: true }
        const ponyUp = await Sample.findByIdAndUpdate( id, upData, options)
        res.send(ponyUp)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }

})
.delete("/sample/:id", async (req, res) => {
    try {
        const id = req.params.id
        const data = await Sample.findByIdAndDelete(id)
        res.send(`${data.username} wouldn't be a Pony rockstar anymore 😔` )
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

export default router;

