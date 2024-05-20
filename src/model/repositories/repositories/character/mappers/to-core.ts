import {
    character as PrismaCharacter,
    nemesis as PrismaNemesis,
    secret as PrismaSecret,
} from '@prisma/client'
import { Character } from '@root/model/entities/character'
import { HasMany, HasOne } from '@root/model/entities/helpers/relationship'
import { Nemesis } from '@root/model/entities/nemesis'
import { Secret } from '@root/model/entities/secret'

export const toCoreCharacter = (
    character: PrismaCharacter & {
        nemeses?: PrismaNemesis[]
    },
): Character => {
    const {
        ability,
        beer_consumption,
        born,
        gender,
        id,
        in_space_since,
        knows_the_answer,
        minimal_distance,
        name,
        weight,
        nemeses,
    } = character
    return new Character({
        ability,
        beerConsumption: beer_consumption,
        born,
        id,
        inSpaceSince: in_space_since,
        knowsTheAnswer: knows_the_answer,
        minimalDistance: Number(minimal_distance),
        name,
        weight: Number(weight),
        nemeses: nemeses
            ? HasMany.loaded('character.nemeses', nemeses.map(toCoreNemesis))
            : HasMany.unloaded('character.nemeses'),
        gender,
    })
}

export const toCoreNemesis = (
    nemesis: PrismaNemesis & {
        character?: PrismaCharacter
        secrets?: PrismaSecret[]
    },
): Nemesis => {
    const { character, id, is_alive, secrets, years } = nemesis
    return new Nemesis({
        id,
        isAlive: is_alive,
        years: years ? Number(years) : undefined,
        character: character
            ? HasOne.loaded('nemesis.character', toCoreCharacter(character))
            : HasOne.unloaded('nemesis.character'),
        secrets: secrets
            ? HasMany.loaded('nemesis.secrets', secrets.map(toCoreSecret))
            : HasMany.unloaded('nemesis.secrets'),
    })
}

export const toCoreSecret = (
    secret: PrismaSecret & {
        nemesis?: PrismaNemesis
    },
): Secret => {
    const { id, secret_code, nemesis } = secret
    return new Secret({
        id,
        secretCode: BigInt(secret_code),
        nemesis: nemesis
            ? HasOne.loaded('secret.nemesis', toCoreNemesis(nemesis))
            : HasOne.unloaded('secret.nemesis'),
    })
}
