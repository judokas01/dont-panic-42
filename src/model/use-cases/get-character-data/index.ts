import { Injectable } from '@nestjs/common'
import { CharacterRepository } from '@root/model/repositories/repositories/character'

@Injectable()
export class GetCharactersDataUseCase {
    constructor(private characterRepository: CharacterRepository) {}

    get = async () => {}
}
