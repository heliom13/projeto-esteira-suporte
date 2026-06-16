import api from './api'

export class AuthService {
  static async createUser(data) {
    return api.post('users/basic', {
      name: data.name,
      email: data.mail,
      password: data.password,
    })
  }

  static async findAll() {
    return api.get('users')
  }

  static async resetPassword(email, data) {
    return api.put(`/users/${email}/reset`, {
      password: data.password
    })
  }
}
