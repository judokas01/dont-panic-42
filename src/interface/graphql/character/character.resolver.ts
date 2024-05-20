import { Query, Resolver } from '@nestjs/graphql'

import { Character, GetCharacters } from './response-type'
import { GetCharactersDataUseCase } from '@root/model/use-cases/get-character-data'

@Resolver(() => Character)
export class CharacterResolver {
    constructor(private getCharactersUseCase: GetCharactersDataUseCase) {}

    @Query(() => GetCharacters, { nullable: true })
    async getCharacters(): Promise<GetCharacters> {
        await this.getCharactersUseCase.get()
        return { content: '' }
    }
}
