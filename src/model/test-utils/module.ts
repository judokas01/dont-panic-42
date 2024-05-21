import { Test } from '@nestjs/testing'
import { CharacterRepository } from '../repositories/character'
import { GetCharactersDataUseCase } from '../use-cases/get-character-data'
import { NemesisRepository } from '../repositories/nemesis'
import { SecretRepository } from '../repositories/secret'
import { PrismaService } from '@root/infrastructure/prisma/client'

export const getTestingModule = async () => {
    const testingApp = await Test.createTestingModule({
        providers: [
            GetCharactersDataUseCase,
            CharacterRepository,
            SecretRepository,
            NemesisRepository,
            PrismaService,
        ],
    }).compile()

    return {
        testingApp,
        useCase: testingApp.get<GetCharactersDataUseCase>(GetCharactersDataUseCase),
        repositories: {
            characterRepository: testingApp.get<CharacterRepository>(CharacterRepository),
            secretRepository: testingApp.get<SecretRepository>(SecretRepository),
            nemesisRepository: testingApp.get<NemesisRepository>(NemesisRepository),
        },
    }
}

export const cleanDatabase = async (repositories: TestingAppRepositories) => {
    const { characterRepository, secretRepository, nemesisRepository } = repositories
    // mind the order of clearing the repositories
    const reposToClear = [secretRepository, nemesisRepository, characterRepository]
    for (const iterator of reposToClear) {
        await iterator.clear()
    }
}

export type TestingApp = Awaited<ReturnType<typeof getTestingModule>>
export type TestingAppRepositories = Awaited<ReturnType<typeof getTestingModule>>['repositories']
