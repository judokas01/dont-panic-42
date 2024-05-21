import { Injectable } from '@nestjs/common'
import { toCoreNemesis } from '../common/mappers'
import { PrismaService } from '@root/infrastructure/prisma/client'
import { CreateNemesisData, Nemesis } from '@root/model/entities/nemesis'

@Injectable()
export class NemesisRepository {
    constructor(private prisma: PrismaService) {}

    insertOne = async (data: CreateNemesisData): Promise<Nemesis> => {
        const created = await this.prisma.nemesis.create({
            data: {
                is_alive: data.isAlive,
                years: data.years,
                character_id: data.character.getId(),
            },
        })
        return toCoreNemesis(created)
    }

    clear = async (): Promise<void> => {
        await this.prisma.nemesis.deleteMany()
    }
}
