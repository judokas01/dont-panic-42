import { Injectable } from '@nestjs/common'
import { toCoreCharacter } from './mappers/to-core'
import { PrismaService } from '@root/infrastructure/prisma/client'
import { Character } from '@root/model/entities/character'

@Injectable()
export class CharacterRepository {
    constructor(private prisma: PrismaService) {}

    // insertOne = async (data: Immutable<CharacterData>): Promise<CharacterData> => {
    //     const user = await this.prisma.user.create({ data: toPrismaUserCreate(data) })
    //     return toUser(user)
    // }

    findAll = async (): Promise<Character[]> => {
        const found = await this.prisma.character.findMany({
            include: {
                nemeses: true,
            },
        })
        return found.map(toCoreCharacter)
    }

    clear = async (): Promise<void> => {
        await this.prisma.user.deleteMany()
    }
}
