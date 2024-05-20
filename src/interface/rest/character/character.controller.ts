import { Controller, Get } from '@nestjs/common'

import { CharactersWithStatsResponse, toCharacterResponse } from './response'
import { GetCharactersDataUseCase } from '@root/model/use-cases/get-character-data'

@Controller()
export class CharacterController {
    constructor(private getCharactersUseCase: GetCharactersDataUseCase) {}

    @Get('/characters')
    async getAllCharacters(): Promise<CharactersWithStatsResponse> {
        const result = await this.getCharactersUseCase.get()

        return toCharacterResponse(result)
    }
}
