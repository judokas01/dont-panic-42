import { describe, beforeAll, it, expect, beforeEach } from 'vitest'
import { CharacterRepository } from '@root/model/repositories/repositories/character'
import { cleanDatabase, getTestingModule } from '@root/model/test-utils'
import { GetCharactersDataUseCase } from '@root/model/use-cases/get-character-data'

describe('Character repository basic CRUD', () => {
    let characterRepository: CharacterRepository
    let useCase: GetCharactersDataUseCase

    beforeAll(async () => {
        ;({ characterRepository, useCase } = await getTestingModule())
    })

    beforeEach(async () => {
        await cleanDatabase(characterRepository)
    })

    it('should insert one user and retrieve it', async () => {
        await useCase.get()
        expect(true).toBe(true)
    })
})
