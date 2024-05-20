import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { CharacterController } from './rest/character/character.controller'
import { CharacterResolver } from './graphql/character/character.resolver'
import { PrismaService } from '@root/infrastructure/prisma/client'
import { CharacterRepository } from '@root/model/repositories/character'
import { GetCharactersDataUseCase } from '@root/model/use-cases/get-character-data'

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            playground: true,
            autoSchemaFile: 'schema.gql',
            sortSchema: true,
        }),
    ],
    providers: [GetCharactersDataUseCase, CharacterRepository, PrismaService, CharacterResolver],
    controllers: [CharacterController],
})
export class InterfaceModule {}
