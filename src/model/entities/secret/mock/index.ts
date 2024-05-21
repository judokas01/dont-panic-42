import { faker } from '@faker-js/faker'
import { CreateSecretData } from '..'
import { HasOne } from '../../helpers/relationship'

export const getRandomSecretData = ({
    nemesis = HasOne.unloaded('secret.nemesis'),
    secretCode = faker.number.bigInt(),
}: Partial<CreateSecretData> = {}): CreateSecretData => ({
    nemesis,
    secretCode,
})
