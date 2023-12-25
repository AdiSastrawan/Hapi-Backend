require("dotenv").config()
const Hapi = require("@hapi/hapi")
//  notes
const NotesService = require("./services/postgre/NotesService")
const notes = require("./api/notes")
const NotesValidator = require("./validator/notes")

// users
const UsersService = require("./services/postgre/UsersService")
const users = require("./api/users")
const UsersValidator = require("./validator/users")
const init = async () => {
  const notesService = new NotesService()
  const usersService = new UsersService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  })
  await server.register([{
    plugin: notes,
    options: { service: notesService, validator: NotesValidator },

  }, {
    plugin: users,
    options: { service: usersService, validator: UsersValidator },
  }])
  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}
init()
