import { describe, beforeAll, it, beforeEach, afterAll, expect } from 'vitest'
import { CharactersWithStats } from '../response-type'
import { TestingInterfaceApp, getTestingInterfaceApp } from '@root/interface/test-utils'
import { createCharacterSet } from '@root/model/entities/character/mock'
import { cleanDatabase } from '@root/model/test-utils/module'

describe('GQL smoke test', () => {
    let testingApp: TestingInterfaceApp

    beforeAll(async () => {
        testingApp = await getTestingInterfaceApp()
    })

    beforeEach(async () => {
        await cleanDatabase(testingApp.repositories)
    })

    afterAll(async () => {
        await testingApp.stop()
    })

    it('should retrieve characters', async () => {
        await createCharacterSet(
            {
                nemeses: {
                    count: 1,
                    override: () => ({ secretCount: 1 }),
                },
            },
            testingApp.repositories,
        )
        const res = await testingApp.gqlQuery('getCharacters', responseQuery, {}, {})

        const charactersResponse = res.body.data.getCharacters
        expect(charactersResponse).toMatchObject({
            // todo
            characters: expect.any(Array),

            statistics: {
                averageAge: expect.any(Number),
                averageBeerConsumption: expect.any(Number),
                averageNemeses: expect.any(Number),
                averageYearsInSpace: expect.any(Number),
                averageYearsOfBeingNemesis: expect.any(Number),
                characterCount: 1,
                genders: {
                    female: expect.any(Number),
                    male: expect.any(Number),
                    other: expect.any(Number),
                },
            },
        } satisfies CharactersWithStats)
    })
})

const responseQuery = `
    {
        characters {
          ability
          beerConsumption
          born
          gender
          id
          inSpaceSince
          knowsTheAnswer
          minimalDistance
          name
          weight
          nemeses{
            id
            isAlive
            secrets{
              id
              secretCode
            }
            years
            
          }
        }
        statistics{
          averageAge
          averageBeerConsumption
          averageNemeses
          averageYearsInSpace
          averageYearsOfBeingNemesis
          characterCount
          genders{
            female
            male
            other
          }
        }
      }`
