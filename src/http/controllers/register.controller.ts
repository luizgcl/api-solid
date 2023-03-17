import { UserWithSameEmailError } from './../../use-cases/errors/user-with-same-email-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  const registerUseCase = makeRegisterUseCase()

  try {
    await registerUseCase.handle({ name, email, password })
  } catch (err) {
    if (err instanceof UserWithSameEmailError) return reply.status(409).send()
    throw err
  }

  return reply.status(201).send()
}
