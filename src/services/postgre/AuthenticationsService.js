const { Pool } = require("pg");
const InvariantError = require("../../exception/InvariantError");

class AuthenticationsService {
  constructor() {
    this.pool = new Pool()
  }
  async addRefreshToken(token) {
    const query = {
      text: "INSERT INTO authentications VALUE ($1) ",
      values: [token],
    }
    await this.pool.query(query)
  }
  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Refresh token tidak valid')
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    await this.pool.query(query);
  }
}
module.exports = AuthenticationsService
