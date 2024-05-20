import {
    Character as GqlCharacter,
    CharactersWithStats,
    Nemesis as GqlNemesis,
    Secret as GqlSecret,
} from './response-type'
import { Character } from '@root/model/entities/character'
import { Nemesis } from '@root/model/entities/nemesis'
import { Secret } from '@root/model/entities/secret'
import { Immutable } from '@root/model/lib/typescript'
import { CharactersResponse } from '@root/model/use-cases/get-character-data'

export const toCharacterResponse = (result: CharactersResponse): CharactersWithStats => {
    const { characters, stats } = result

    const statistics: CharactersWithStats['statistics'] = {
        averageAge: stats.averageAge,
        averageBeerConsumption: stats.averageBeerConsumption,
        averageNemeses: stats.averageNemeses,
        averageYearsInSpace: stats.averageYearsInSpace,
        averageYearsOfBeingNemesis: stats.averageYearsOfBeingNemesis,
        characterCount: stats.characterCount,
        genders: stats.genders,
    }

    return {
        characters: characters.map(toCharacter),
        statistics,
    }
}

const toCharacter = (character: Character): GqlCharacter => {
    const { data } = character

    return {
        ability: data.ability,
        beerConsumption: data.beerConsumption,
        born: data.born,
        id: character.id,
        inSpaceSince: data.inSpaceSince,
        knowsTheAnswer: data.knowsTheAnswer,
        minimalDistance: data.minimalDistance,
        name: data.name,
        nemeses: data.nemeses.isLoaded() ? data.nemeses.get().map(toNemesis) : null,
        weight: data.weight,
        gender: data.gender ?? null,
    }
}

const toNemesis = (nemesis: Immutable<Nemesis>): GqlNemesis => {
    const { data } = nemesis

    return {
        id: nemesis.id,
        isAlive: data.isAlive,
        secrets: data.secrets.isLoaded() ? data.secrets.get().map(toSecret) : null,
        years: data.years,
    }
}

const toSecret = (secret: Immutable<Secret>): GqlSecret => {
    return {
        id: secret.id,
        secretCode: secret.data.secretCode,
    }
}
