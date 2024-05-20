import { toLower } from 'ramda'
import { CharacterData } from '@root/model/entities/character'

export const isFemale = (gender: CharacterData['gender']) => {
    const femaleAliases = ['female', 'f']

    return gender && femaleAliases.includes(toLower(gender))
}

export const isMale = (gender: CharacterData['gender']) => {
    const maleAliases = ['male', 'm']

    return gender && maleAliases.includes(toLower(gender))
}
