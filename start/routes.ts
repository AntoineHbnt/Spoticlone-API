import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => ({ uptime: process.uptime() }))

Route.get('/me', 'AuthController.me')
Route.get('/auth/check', 'AuthController.check')
Route.post('/auth/logout', 'AuthController.logout')
Route.get('/oauth/:provider/redirect', 'AuthController.redirect').where('provider', /spotify/)
Route.get('/oauth/:provider/callback', 'AuthController.callback').where('provider', /spotify/)
