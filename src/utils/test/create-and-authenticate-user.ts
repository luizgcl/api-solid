import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    password: '1234567890',
  })

  const authenticateResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: 'john.doe@gmail.com',
      password: '1234567890',
    })

  const { token } = authenticateResponse.body

  return {
    token,
  }
}
