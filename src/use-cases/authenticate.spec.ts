import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { it, describe, expect } from 'vitest'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhon.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.handle({
      email: 'jhon.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await expect(() =>
      sut.handle({
        email: 'jhon.doe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhon.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.handle({
        email: 'other-email@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
