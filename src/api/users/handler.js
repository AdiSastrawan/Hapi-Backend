class UsersHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    this.validator.validateUserPayload(request.payload);
    const { fullname, password, username } = request.payload
    const result = await this.service.addUser({ fullname, password, username })
    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId: result,
      },
    })
    response.code(201)
    return response
  }
  async getUserByIdHandler(request, h) {
    const { id } = request.params;

    const user = await this.service.getUserById(id);

    return {
      status: 'success',
      data: {
        user,
      },
    }
  }
}
module.exports = UsersHandler
