import { ApiProperty } from '@nestjs/swagger'
import { CharactersWithStats } from '@root/interface/graphql/character/response-type'
import { CharactersResponse } from '@root/model/use-cases/get-character-data'

export class CharactersWithStatsResponse {
    @ApiProperty()
    id: string
}

export const toCharacterResponse = (result: CharactersResponse): CharactersWithStats => {
    const { characters, stats } = result
}
