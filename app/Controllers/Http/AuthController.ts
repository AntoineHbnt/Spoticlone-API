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
    try {
      const provider = await ally.use(params.provider)

      if (provider.accessDenied()) {
        return 'Access was denied'
      }

      if (provider.stateMisMatch()) {
        return 'Request expired. Retry again'
      }

      if (provider.hasError()) {
        return provider.getError()
      }

      const socialUser = await provider.user()

      // @ts-ignore
      await new SocialAuth(socialUser, params.provider).onFindOrCreate(async (user: User) => {
        await auth.login(user)

        response.redirect().toPath('http://localhost:5173')
      })
    } catch (err) {
      console.error(err.response)
      throw err
    }
  }

  public async logout({ auth }: HttpContextContract) {
    return await auth.logout()
  }
}
