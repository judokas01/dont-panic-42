import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from '@root/infrastructure/prisma/client'
import { InterfaceModule } from '@root/interface'
import { CharacterRepository } from '@root/model/repositories/character'
import { NemesisRepository } from '@root/model/repositories/nemesis'
import { SecretRepository } from '@root/model/repositories/secret'
import { GetCharactersDataUseCase } from '@root/model/use-cases/get-character-data'

@Module({
    imports: [ConfigModule.forRoot(), InterfaceModule],
    controllers: [],
    providers: [
        GetCharactersDataUseCase,
        CharacterRepository,
        SecretRepository,
        NemesisRepository,
        PrismaService,
    ],
})
export class DontPanicApp {}
