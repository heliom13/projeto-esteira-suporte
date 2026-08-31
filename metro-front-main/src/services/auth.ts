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

  static async forgotPassword(email: string) {
    return api.post('/users/forgot-password', {email})
  }

  static async resetPasswordWithToken(token: string, password: string) {
    return api.post('/users/reset-password', {token, password})
  }
}
