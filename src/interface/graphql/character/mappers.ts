import { CharactersWithStats } from './response-type'
import { CharactersResponse } from '@root/model/use-cases/get-character-data'

export const toCharacterResponse = (result: CharactersResponse): CharactersWithStats => {
    const { characters, stats } = result

    const statistics: CharactersWithStats['statistics'] = {
        averageAge: stats.averageAge,
        averageBeerConsumption: stats.averageBeerConsumption,
        averageNemeses: stats.averageNemeses,
        averageYearsInSpace: stats.averageYearsInSpace,
        averageYearsOfBeingNemesis: stats.averageYearsOfBeingNemesis,
        characterCount: stats.characterCount,
        genders: stats.genders,
    }

    return {
        statistics,
    }
}
