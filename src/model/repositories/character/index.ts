import { Injectable } from '@nestjs/common'
import { toCoreCharacter } from '../common/mappers'
import { PrismaService } from '@root/infrastructure/prisma/client'
import { Character, CreateCharacterData } from '@root/model/entities/character'

@Injectable()
export class CharacterRepository {
    constructor(private prisma: PrismaService) {}

    insertOne = async (data: CreateCharacterData): Promise<Character> => {
        const created = await this.prisma.character.create({
            data: {
                ability: data.ability,
                beer_consumption: data.beerConsumption,
                born: data.born,
                knows_the_answer: data.knowsTheAnswer,
                minimal_distance: data.minimalDistance,
                name: data.name,
                gender: data.gender,
                in_space_since: data.inSpaceSince,
                weight: data.weight,
            },
        })

        return toCoreCharacter(created)
    }

    findAll = async (): Promise<Character[]> => {
        const found = await this.prisma.character.findMany({
            include: {
                nemeses: {
                    include: {
                        secrets: true,
                    },
                },
            },
        })

        return found.map(toCoreCharacter)
    }

    clear = async (): Promise<void> => {
        await this.prisma.character.deleteMany()
    }
}
