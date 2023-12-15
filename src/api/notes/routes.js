const routes = (handler) => [
  {
    path: "/notes",
    method: "POST",
    handler: handler.postNoteHandler,
  },
  {
    path: "/notes",
    method: "GET",
    handler: handler.getNotesHandler,
  },
  {
    path: "/notes/{id}",
    method: "GET",
    handler: handler.getNoteByIdHandler,
  },
  {
    path: "/notes/{id}",
    method: "PUT",
    handler: handler.putNoteByIdHandler,
  },
  {
    path: "/notes/{id}",
    method: "DELETE",
    handler: handler.deleteNoteByIdHandler,
  },
]

module.exports = routes
