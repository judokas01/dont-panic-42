import { faker } from '@faker-js/faker'
import { CreateCharacterData } from '..'
import { getRandomNemesisData } from '../../nemesis/mock'
import { HasOne } from '../../helpers/relationship'
import { getRandomSecretData } from '../../secret/mock'
import { NemesisData } from '../../nemesis'
import { CreateSecretData } from '../../secret'
import { TestingAppRepositories } from '@root/model/test-utils/module'
import { coinFlip } from '@root/model/test-utils/tools'

export const getRandomCharacterData = ({
    ability = 'ability',
    beerConsumption = faker.number.int({ min: 0, max: 10000 }),
    born = faker.date.past(),
    gender = faker.person.gender(),
    inSpaceSince = coinFlip() ? faker.date.past() : null,
    knowsTheAnswer = coinFlip(),
    minimalDistance = faker.number.int({ min: 0, max: 10000 }),
    name = faker.person.fullName(),
    weight = faker.number.int({ min: 0, max: 10000 }),
}: Partial<CreateCharacterData> = {}): CreateCharacterData => ({
    ability,
    beerConsumption,
    born,
    inSpaceSince,
    knowsTheAnswer,
    minimalDistance,
    name,
    weight,
    gender,
})

export const createCharacterSet = async (
    overrides: {
        character?: Partial<CreateCharacterData>
        nemeses?: {
            count?: number
            override?: (i?: number) => Partial<NemesisOverride>
        }
    },
    repositories: TestingAppRepositories,
) => {
    const { character, nemeses } = overrides
    const createdCharacter = await repositories.characterRepository.insertOne(
        getRandomCharacterData({ ...character }),
    )

    await Promise.all(
        Array.from({ length: nemeses?.count ?? randomCount() }).map(async (_, i) => {
            const nemesis = await repositories.nemesisRepository.insertOne(
                getRandomNemesisData({
                    character: HasOne.loaded('nemesis.character', createdCharacter),
                    ...nemeses?.override?.(i),
                }),
            )

            await Promise.all(
                Array.from({ length: nemeses?.override?.(i)?.secretCount ?? randomCount() }).map(
                    (_, i) =>
                        repositories.secretRepository.insertOne(
                            getRandomSecretData({
                                nemesis: HasOne.loaded('secret.nemesis', nemesis),
                                ...nemeses?.override?.(i)?.secretOverride?.(i),
                            }),
                        ),
                ),
            )
        }),
    )
}

type NemesisOverride = Omit<NemesisData, 'id' | 'character'> & {
    secretCount?: number
    secretOverride?: (i?: number) => Partial<CreateSecretData>
}

export const randomCount = () => faker.number.int({ min: 0, max: 5 })
