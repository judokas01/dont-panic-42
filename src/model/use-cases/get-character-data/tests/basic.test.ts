import { describe, beforeAll, it, expect, beforeEach } from 'vitest'
import {
    CharactersResponse,
    GetCharactersDataUseCase,
} from '@root/model/use-cases/get-character-data'
import {
    TestingAppRepositories,
    cleanDatabase,
    getTestingModule,
} from '@root/model/test-utils/module'
import { createCharacterSet, randomCount } from '@root/model/entities/character/mock'
import { HasMany, HasOne } from '@root/model/entities/helpers/relationship'
import { CharacterData } from '@root/model/entities/character'
import { NemesisData } from '@root/model/entities/nemesis'
import { SecretData } from '@root/model/entities/secret'

describe('Get characters use case base tests', () => {
    let repositories: TestingAppRepositories
    let useCase: GetCharactersDataUseCase

    beforeAll(async () => {
        ;({ repositories, useCase } = await getTestingModule())
    })

    beforeEach(async () => {
        await cleanDatabase(repositories)
    })

    describe('Statistics tests', () => {
        it('should return all stats zero when no character exists', async () => {
            const result = await useCase.get()
            expect(result).toMatchSnapshot()
        })

        it('should return stats with random values when characters exist', async () => {
            await createCharacterSet({}, repositories)
            await createCharacterSet({}, repositories)
            await createCharacterSet({}, repositories)

            const result = await useCase.get()
            expect(result).toMatchObject({
                characters: expect.any(Array),
                stats: {
                    averageAge: expect.any(Number),
                    averageBeerConsumption: expect.any(Number),
                    averageNemeses: expect.any(Number),
                    averageYearsInSpace: expect.any(Number),
                    averageYearsOfBeingNemesis: expect.any(Number),
                    characterCount: 3,
                    genders: {
                        female: expect.any(Number),
                        male: expect.any(Number),
                        other: expect.any(Number),
                    },
                },
            } satisfies CharactersResponse)
        })

        it('should return expected stats', async () => {
            await createCharacterSet(
                {
                    character: {
                        born: new Date('2000-01-01'),
                        beerConsumption: 17,
                        gender: 'f',
                        inSpaceSince: null,
                    },
                    nemeses: {
                        count: 11,
                    },
                },
                repositories,
            )

            await createCharacterSet(
                {
                    character: {
                        born: new Date('1958-01-01'),
                        beerConsumption: 42,
                        gender: 'some other',
                        inSpaceSince: new Date('1900-01-01'),
                    },
                    nemeses: {
                        count: 0,
                    },
                },
                repositories,
            )

            const result = await useCase.get()

            expect(result.stats).toMatchObject({
                // this should be calculated or we will celebrate new year with flaky test
                averageAge: 45,
                averageBeerConsumption: (42 + 17) / 2,
                averageNemeses: (11 + 0) / 2,
                // this should be calculated or we will celebrate new year with flaky test
                averageYearsInSpace: 124 / 2,
                averageYearsOfBeingNemesis: expect.any(Number),
                characterCount: 2,
                genders: {
                    female: 1,
                    male: 0,
                    other: 1,
                },
            } satisfies CharactersResponse['stats'])
        })

        it('should return expected stats nemeses related stats', async () => {
            const char1NemesisCount = 3
            const char2NemesisCount = 5
            await createCharacterSet(
                {
                    nemeses: {
                        count: char1NemesisCount,
                        override: (i) => ({ years: i * 66 }),
                    },
                },
                repositories,
            )

            await createCharacterSet(
                {
                    nemeses: {
                        count: char2NemesisCount,
                        override: (i) => ({ years: i * 10 }),
                    },
                },
                repositories,
            )

            /**
             * 0 + 66 + 132 = 198
             * 0 + 10 + 20 + 30 + 40 = 100
             * (198 + 100) / 2 = 132
             */
            const expectedYears = 149
            const result = await useCase.get()

            expect(result.stats.averageNemeses).toBe((char1NemesisCount + char2NemesisCount) / 2)
            expect(result.stats.averageYearsOfBeingNemesis).toBe(expectedYears)
        })
    })

    describe('characters tests', () => {
        it('should return a character set with all the related data', async () => {
            await createCharacterSet(
                {
                    nemeses: {
                        count: randomCount(),
                        override: () => ({ secretCount: randomCount() }),
                    },
                },
                repositories,
            )
            await createCharacterSet(
                {
                    nemeses: {
                        count: randomCount(),
                        override: () => ({ secretCount: randomCount() }),
                    },
                },
                repositories,
            )
            const result = await useCase.get()
            expect(result.characters).toHaveLength(2)
            result.characters.forEach(({ data }) => {
                expect(data).toMatchObject({
                    id: expect.any(Number),
                    name: expect.any(String),
                    ability: expect.any(String),
                    beerConsumption: expect.any(Number),
                    born: expect.any(Date),
                    inSpaceSince: data.inSpaceSince ? expect.any(Date) : null,
                    knowsTheAnswer: expect.any(Boolean),
                    minimalDistance: expect.any(Number),
                    nemeses: expect.any(HasMany),
                    weight: expect.any(Number),
                    gender: expect.any(String),
                } satisfies CharacterData)

                const nemeses = data.nemeses.get()

                nemeses.forEach(({ data: nemesisData }) => {
                    expect(nemesisData).toMatchObject({
                        id: expect.any(Number),
                        isAlive: expect.any(Boolean),
                        years: expect.any(Number),
                        character: expect.any(HasOne),
                        secrets: expect.any(HasMany),
                    } as NemesisData)

                    const secrets = nemesisData.secrets.get()

                    secrets.forEach(({ data }) => {
                        expect(data).toMatchObject({
                            id: expect.any(Number),
                            secretCode: expect.any(BigInt),
                            nemesis: expect.any(HasOne),
                        } satisfies SecretData)
                    })
                })
            })
        })
    })
})
