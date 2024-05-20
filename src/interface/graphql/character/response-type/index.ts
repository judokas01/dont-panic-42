import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CharactersWithStats {
    @Field(() => CharactersStatistics)
    statistics: CharactersStatistics

    @Field(() => [Character])
    characters: Character[]
}

@ObjectType()
export class CharactersStatistics {
    @Field()
    characterCount: number

    @Field()
    averageAge: number

    @Field()
    averageYearsInSpace: number

    @Field()
    averageBeerConsumption: number

    @Field(() => GenderStatistics)
    genders: GenderStatistics

    @Field()
    averageNemeses: number

    @Field()
    averageYearsOfBeingNemesis: number
}

@ObjectType()
export class GenderStatistics {
    @Field()
    male: number

    @Field()
    female: number

    @Field()
    other: number
}

@ObjectType()
export class Character {
    @Field()
    id: number

    @Field()
    name: string

    @Field(() => String, { nullable: true })
    gender?: string

    @Field()
    ability: string

    @Field()
    minimalDistance: number

    @Field()
    weight: number

    @Field()
    born: Date

    @Field(() => Date, { nullable: true })
    inSpaceSince: Date | null

    @Field()
    beerConsumption: number

    @Field()
    knowsTheAnswer: boolean

    @Field(() => [Nemesis], { nullable: true })
    nemeses: Nemesis[]
}

@ObjectType()
export class Nemesis {
    @Field()
    id: number

    @Field()
    isAlive: boolean

    @Field(() => Number, { nullable: true })
    years?: number

    @Field(() => Secret, { nullable: true })
    secrets: string
}

@ObjectType()
export class Secret {
    @Field()
    id: number

    @Field()
    secretCode: bigint
}
