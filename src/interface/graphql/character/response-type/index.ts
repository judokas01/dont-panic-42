import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'The article model' })
export class Character {
    @Field(() => ID)
    id: string

    @Field()
    perex: string

    @Field()
    title: string

    @Field()
    createdAt: Date

    @Field()
    authorUsername: string
}

@ObjectType({ description: 'The article model' })
export class GetCharacters {
    @Field()
    content: string
}
