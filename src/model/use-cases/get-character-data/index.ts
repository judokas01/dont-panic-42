import { Injectable } from '@nestjs/common'
import { isFemale, isMale } from './lib/genders'
import { toTwoDecimals } from './lib/round'
import { Character } from '@root/model/entities/character'
import { CharacterRepository } from '@root/model/repositories/character'

@Injectable()
export class GetCharactersDataUseCase {
    constructor(private characterRepository: CharacterRepository) {}

    get = async (): Promise<CharactersResponse> => {
        const characters = await this.characterRepository.findAll()

        const characterCount = characters.length

        const stats: CharacterStats = {
            characterCount,
            averageAge: toTwoDecimals(this.getAverageAge(characters)),
            averageBeerConsumption: toTwoDecimals(this.getAverageBeerConsumption(characters)),
            averageYearsInSpace: toTwoDecimals(this.getAverageYearsInSpace(characters)),
            averageNemeses: toTwoDecimals(this.getNemesisCount(characters)),
            averageYearsOfBeingNemesis: toTwoDecimals(
                this.getAverageTimeOfBeingNemesis(characters),
            ),
            genders: this.getGenderStats(characters),
        }

        return {
            characters,
            stats,
        }
    }

    private getAverageAge = (characters: Character[]) => {
        if (!characters.length) return 0
        return characters.reduce((acc, e) => (acc += e.age), 0) / characters.length
    }

    private getAverageBeerConsumption = (characters: Character[]) => {
        if (!characters.length) return 0
        return characters.reduce((acc, e) => (acc += e.data.beerConsumption), 0) / characters.length
    }

    private getAverageYearsInSpace = (characters: Character[]) => {
        if (!characters.length) return 0
        return characters.reduce((acc, e) => (acc += e.yearsInSpace), 0) / characters.length
    }

    private getNemesisCount = (characters: Character[]) => {
        if (!characters.length) return 0
        return (
            characters.reduce((acc, e) => (acc += e.data.nemeses.get().length), 0) /
            characters.length
        )
    }

    private getAverageTimeOfBeingNemesis = (characters: Character[]) => {
        if (!characters.length) return 0
        const sumOfNemesesYears = characters
            .flatMap((ch) => ch.data.nemeses.get())
            .reduce((acc, e) => (acc += e.data.years ?? 0), 0)

        return sumOfNemesesYears / characters.length
    }

    private getGenderStats = (characters: Character[]): CharacterStats['genders'] => {
        const genders: CharacterStats['genders'] = characters.reduce(
            (acc, { data }) => {
                if (isFemale(data.gender)) {
                    return { ...acc, female: acc.female + 1 }
                }
                if (isMale(data.gender)) {
                    return { ...acc, male: acc.male + 1 }
                }
                return { ...acc, other: acc.other + 1 }
            },
            {
                male: 0,
                female: 0,
                other: 0,
            },
        )

        return genders
    }
}

export type CharactersResponse = {
    characters: Character[]
    stats: CharacterStats
}

type CharacterStats = {
    characterCount: number
    averageAge: number
    averageYearsInSpace: number
    averageBeerConsumption: number
    genders: {
        male: number
        female: number
        other: number
    }
    averageNemeses: number
    averageYearsOfBeingNemesis: number
}
