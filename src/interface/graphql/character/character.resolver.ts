import { Query, Resolver } from '@nestjs/graphql'
import { CharactersWithStats } from './response-type'
import { toCharacterResponse } from './mappers'
import { GetCharactersDataUseCase } from '@root/model/use-cases/get-character-data'

@Resolver(() => CharactersWithStats)
export class CharacterResolver {
    constructor(private getCharactersUseCase: GetCharactersDataUseCase) {}

    @Query(() => CharactersWithStats)
    async getCharacters(): Promise<CharactersWithStats> {
        const result = await this.getCharactersUseCase.get()
        return toCharacterResponse(result)
    }
}
