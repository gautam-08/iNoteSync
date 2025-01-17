const express = require('express');
const router = express.Router();
const Note = require("../models/Note");
const fetchuser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');

//Route 1: Get All the notes using: GET "api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }
})
//Route 2: Add a new notes using: POST "api/notes/addnotes". Login required
router.post('/addnotes', fetchuser, [
    body('title', 'Enter a valid Title ').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 character').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //if there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()

        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }


})

//Route 3: Update a notes using: PUT "api/notes/updatenotes". Login required
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //Create a Newnote Object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the note to be updated and and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }
});


//Route 4: Delete a notes using: Delete "api/notes/deletenotes". Login required
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
    try {

        //Find the note to be deleted and and delete it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found")
        }

        //Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }
});

module.exports = router