const { Pool } = require('pg');
const InvariantError = require("../../exception/InvariantError");
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');


class UsersService {
  constructor() {
    this.pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
    });
  }

  async addUser({ username, password, fullname }) {
    console.log('verifying user')
    await this.verifyNewUsername(username)
    console.log('adding user')
    const id = `user-${nanoid(16)}`
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('adding password')
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT usernames FROM users WHERE usernames = $1',
      values: [username],
    }
    console.log("test")
    const result = await this.pool.query(query)


    if (result.rows.length) {
      console.log(result.rows)
      throw new InvariantError(
        'Gagal menambahkan user. Username sudah digunakan.'
      )
    }
  }
  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }
  async verifyUserCredentials(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah')
    }
    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah')
    }
    return id
  }
}
module.exports = UsersService