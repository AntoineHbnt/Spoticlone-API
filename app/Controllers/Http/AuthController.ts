import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import SocialAuth from 'App/Services/SocialAuth'

export default class AuthController {
  public me({ auth, response }: HttpContextContract) {
    if (!auth.user) {
      return response.unauthorized()
    }

    return auth.user
  }

  public async check({ auth, response }: HttpContextContract) {
    return response.ok({
      authenticated: auth.isAuthenticated,
    })
  }

  public async redirect({ ally, params }: HttpContextContract) {
    return await ally.use(params.provider).redirect()
  }

  public async callback({ ally, auth, params, response }: HttpContextContract) {
    const socialUser = await ally.use(params.provider).user()

    // @ts-ignore
    await new SocialAuth(socialUser, params.provider).onFindOrCreate(async (user: User) => {
      await auth.login(user)

      response.redirect().toPath('http://localhost:5173')
    })
  }

  public async logout({ auth }: HttpContextContract) {
    return await auth.logout()
  }
}
