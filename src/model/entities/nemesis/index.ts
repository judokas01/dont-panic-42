import { Character } from '../character'
import { HasMany, HasOne } from '../helpers/relationship'
import { Clonable } from '../helpers/relationship/clone'
import type { Secret } from '../secret'
import { Immutable } from '@root/model/lib/typescript'

export class Nemesis implements Clonable<Nemesis> {
    constructor(private nemesis: NemesisData) {}

    get id(): Immutable<NemesisData['id']> {
        return this.nemesis.id
    }

    get data(): Immutable<NemesisData> {
        return this.nemesis
    }

    clone = (): Nemesis => new Nemesis({ ...this.nemesis })
}

export type NemesisData = {
    id: number
    isAlive: boolean
    years?: number
    character: HasOne<Character>
    secrets: HasMany<Secret>
}

export type CreateNemesisData = Omit<NemesisData, 'id' | 'secrets'>
