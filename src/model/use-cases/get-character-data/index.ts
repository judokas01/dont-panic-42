import { Injectable } from '@nestjs/common'
import { Character } from '@root/model/entities/character'
import { Nemesis } from '@root/model/entities/nemesis'
import { CharacterRepository } from '@root/model/repositories/character'

@Injectable()
export class GetCharactersDataUseCase {
    constructor(private characterRepository: CharacterRepository) {}

    get = async () => {
        const allCharacters = await this.characterRepository.findAll()

        const characterCount = allCharacters.length
        console.log({ allCharacters: allCharacters.map((e) => e.data) })

        const stats: CharacterStats = {
            characterCount,
            averageAge: this.getAverageAge(allCharacters),
            averageBeerConsumption: this.getAverageBeerConsumption(allCharacters),
            averageYearsInSpace: this.getAverageYearsInSpace(allCharacters),
            averageNemeses: this.getNemesisCount(allCharacters),
            averageYearsOfBeingNemesis: this.getAverageTimeOfBeingNemesis(allCharacters),
        }

        console.log({ stats })
    }

    private getAverageAge = (characters: Character[]) => {
        return characters.reduce((acc, e) => (acc += e.age), 0) / characters.length
    }

    private getAverageBeerConsumption = (characters: Character[]) => {
        return characters.reduce((acc, e) => (acc += e.data.beerConsumption), 0) / characters.length
    }

    private getAverageYearsInSpace = (characters: Character[]) => {
        return characters.reduce((acc, e) => (acc += e.yearsInSpace), 0) / characters.length
    }

    private getNemesisCount = (characters: Character[]) => {
        return (
            characters.reduce((acc, e) => (acc += e.data.nemeses.get().length), 0) /
            characters.length
        )
    }

    private getAverageTimeOfBeingNemesis = (characters: Character[]) => {
        const sumOfNemesesYears = characters
            .flatMap((ch) => ch.data.nemeses.get())
            .reduce((acc, e) => (acc += e.data.years ?? 0), 0)

        return sumOfNemesesYears / characters.length
    }

    private getGenderStats = (characters: Character[]): CharacterStats['genders'] => {
        new Map<CharacterStats['genders'], number>()
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
