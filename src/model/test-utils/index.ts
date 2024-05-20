import { Test } from '@nestjs/testing'
import { CharacterRepository } from '../repositories/repositories/character'
import { GetCharactersDataUseCase } from '../use-cases/get-character-data'
import { PrismaService } from '@root/infrastructure/prisma/client'

export const getTestingModule = async () => {
    const testingApp = await Test.createTestingModule({
        providers: [GetCharactersDataUseCase, PrismaService],
    }).compile()

    return {
        testingApp,
        useCase: testingApp.get<GetCharactersDataUseCase>(GetCharactersDataUseCase),
        characterRepository: testingApp.get<CharacterRepository>(CharacterRepository),
    }
}

export const cleanDatabase = async (repo: CharacterRepository) => {
    await repo.clear()
}

export type TestingApp = Awaited<ReturnType<typeof getTestingModule>>
