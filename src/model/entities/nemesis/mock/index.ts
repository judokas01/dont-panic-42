import { faker } from '@faker-js/faker'
import { CreateNemesisData } from '..'
import { HasOne } from '../../helpers/relationship'
import { coinFlip } from '@root/model/test-utils/tools'

export const getRandomNemesisData = ({
    character = HasOne.unloaded('nemesis.character'),
    isAlive = coinFlip(),
    years = faker.number.int({ min: 0, max: 10000 }),
}: Partial<CreateNemesisData> = {}): CreateNemesisData => ({
    character,
    isAlive,
    years,
})
