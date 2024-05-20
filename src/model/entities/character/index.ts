import { HasMany } from '../helpers/relationship'
import { Clonable } from '../helpers/relationship/clone'
import type { Nemesis } from '../nemesis'
import { Immutable } from '@root/model/lib/typescript'

export class Character implements Clonable<Character> {
    constructor(private character: CharacterData) {}

    get id(): Immutable<CharacterData['id']> {
        return this.character.id
    }

    get data(): Immutable<CharacterData> {
        return this.character
    }

    get age(): number {
        return this.diffInYears(new Date(), this.character.born)
    }

    get yearsInSpace(): number {
        return this.diffInYears(new Date(), this.character.inSpaceSince ?? new Date())
    }

    private diffInYears = (date1: Date, date2: Date): number => {
        const differenceInMilliseconds = Math.abs(date1.getTime() - date2.getTime())
        const differenceInYears = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365))
        return differenceInYears
    }

    clone = (): Character => new Character({ ...this.character })
}

export type CharacterData = {
    id: number
    name: string
    gender?: string
    ability: string
    minimalDistance: number
    weight: number
    born: Date
    inSpaceSince: Date | null
    beerConsumption: number
    knowsTheAnswer: boolean
    /**
     * SelfNote: plural of nemesis is `nemeses`
     */
    nemeses: HasMany<Nemesis>
}
