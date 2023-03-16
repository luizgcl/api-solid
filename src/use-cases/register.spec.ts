import { UserWithSameEmailError } from './errors/user-with-same-email-error'
import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { RegisterUseCase } from '@/use-cases/register'
import { compare } from 'bcryptjs'
import { it, describe, expect } from 'vitest'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const { user } = await sut.handle({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const { user } = await sut.handle({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const email = 'jhondoe@example.com'

    await sut.handle({
      name: 'Jhon Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.handle({
        name: 'Jhon Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserWithSameEmailError)
  })
})
