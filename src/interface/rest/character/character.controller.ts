import { Controller, Get } from '@nestjs/common'

import { GetCharactersDataUseCase } from '@root/model/use-cases/get-character-data'

@Controller()
export class CharacterController {
    constructor(private getCharactersUseCase: GetCharactersDataUseCase) {}

    @Get('/characters')
    async getAllCharacters(): Promise<string> {
        await this.getCharactersUseCase.get()

        return 'Hello World'
    }
}
