import { HasOne } from '../helpers/relationship'
import { Clonable } from '../helpers/relationship/clone'
import { Nemesis } from '../nemesis'
import { Immutable } from '@root/model/lib/typescript'

export class Secret implements Clonable<Secret> {
    constructor(private secret: SecretData) {}

    get id(): Immutable<SecretData['id']> {
        return this.secret.id
    }

    get data(): Immutable<SecretData> {
        return this.secret
    }

    clone = (): Secret => new Secret({ ...this.secret })
}

export type SecretData = {
    id: number
    secretCode: bigint
    nemesis: HasOne<Nemesis>
}

export type CreateSecretData = Omit<SecretData, 'id'>
