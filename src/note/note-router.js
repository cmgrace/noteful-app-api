const express = require("express");
const NoteService = require("./note-service");
const jsonParser = express.json();
const xss = require("xss");
const path = require("path");

const noteRouter = express.Router();

const serializeNote = (note) => ({
  id: note.id,
  note_name: xss(note.note_name),
  content: xss(note.content),
  folder_id: note.folder_id,
  date_modified: note.date_modified,
});

noteRouter
  .route("/notes")
  .get((req, res, next) => {
    NoteService.getAllNotes(req.app.get("db"))
      .then((notes) => {
        res.json(notes.map((note) => serializeNote(note)));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { note_name, content, folder_id, date_modified } = req.body;
    const newNote = { note_name, content, folder_id };

    for (const [key, value] of Object.entries(newNote))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    newNote.folder_id = Number(folder_id);

    if (date_modified) {
      newNote.date_modified = date_modified;
    }

    NoteService.insertNote(req.app.get("db"), newNote)
      .then((note) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNote(note));
      })
      .catch(next);
  });

noteRouter
  .route("/notes/:note_id")
  .all((req, res, next) => {
    NoteService.getById(req.app.get("db"), req.params.note_id)
      .then((note) => {
        if (!note) {
          return res.status(404).json({
            error: { message: "note does not exist" },
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note));
  })
  .delete((req, res, next) => {
    NoteService.deleteNote(req.app.get("db"), req.params.note_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = noteRouter;
