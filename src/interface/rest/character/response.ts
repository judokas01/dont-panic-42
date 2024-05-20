import { ApiProperty } from '@nestjs/swagger'

export class Character {
    @ApiProperty()
    id: string
}
