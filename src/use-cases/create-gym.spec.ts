import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { it, beforeEach, describe, expect } from 'vitest'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.handle({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -20.18417351581553,
      longitude: -50.97485376462038,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
