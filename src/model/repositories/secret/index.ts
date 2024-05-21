import { Injectable } from '@nestjs/common'
import { toCoreSecret } from '../common/mappers'
import { PrismaService } from '@root/infrastructure/prisma/client'
import { CreateSecretData, Secret } from '@root/model/entities/secret'

@Injectable()
export class SecretRepository {
    constructor(private prisma: PrismaService) {}

    insertOne = async (data: CreateSecretData): Promise<Secret> => {
        const created = await this.prisma.secret.create({
            data: { secret_code: data.secretCode, nemesis_id: data.nemesis.getId() },
        })
        return toCoreSecret(created)
    }

    clear = async (): Promise<void> => {
        await this.prisma.secret.deleteMany()
    }
}
