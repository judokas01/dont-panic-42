import { IncomingHttpHeaders } from 'http'
import { NestFactory } from '@nestjs/core'
import supertest from 'supertest'

import { DontPanicApp } from '@root/app/newapp.module'
import { CharacterRepository } from '@root/model/repositories/character'
import { SecretRepository } from '@root/model/repositories/secret'
import { NemesisRepository } from '@root/model/repositories/nemesis'

export const getTestingInterfaceApp = async () => {
    const app = await NestFactory.create(DontPanicApp)
    await app.listen(3000)

    const gqlRequest = (
        queryString: string,
        variables: Record<string, unknown> | undefined,
        headers?: IncomingHttpHeaders,
    ): supertest.Request =>
        supertest(app.getHttpServer()).post('/graphql').set(headers).send({
            query: queryString,
            variables,
        })

    const prepareGqlRequest = (
        type: 'query' | 'mutation',
        queryName: string,
        responseQuery: string,
        variables: Variables,
        options?: Options,
    ): {
        gqlQueryString: string
        variableValues: Record<string, unknown>
        headers: IncomingHttpHeaders
    } => {
        const variableDefinitions = Object.entries(variables)
            .map(([varName, { type }]) => `$${varName}: ${type}`)
            .join(',')
        const variableBinds = Object.keys(variables)
            .map((varName) => `${varName}: $${varName}`)
            .join(',')
        const variableValues = Object.entries(variables).reduce((result, [varName, { value }]) => {
            return {
                ...result,
                [varName]: value,
            }
        }, {})
        const { headers = {} } = options ?? {}

        const hasVariables = variableDefinitions.length > 0 && variableBinds.length > 0

        const withoutVariables = `${type} {
            ${queryName} ${responseQuery}
          }`

        const withVariables = `${type}(${variableDefinitions}) {
            ${queryName}(${variableBinds}) ${responseQuery}
          }`

        return {
            gqlQueryString: hasVariables ? withVariables : withoutVariables,
            variableValues,
            headers,
        }
    }

    return {
        app,
        repositories: {
            characterRepository: app.get<CharacterRepository>(CharacterRepository),
            secretRepository: app.get<SecretRepository>(SecretRepository),
            nemesisRepository: app.get<NemesisRepository>(NemesisRepository),
        },
        stop: async () => app.close(),
        httpReq: () => supertest(app.getHttpServer()),
        gqlRequest,
        gqlQuery: (
            queryName: string,
            responseQuery: string,
            variables: Variables,
            options: Options,
        ) => {
            const { gqlQueryString, variableValues, headers } = prepareGqlRequest(
                'query',
                queryName,
                responseQuery,
                variables,
                options,
            )
            return gqlRequest(gqlQueryString, variableValues, headers)
        },
        gqlMutation: (
            mutationName: string,
            responseQuery: string,
            variables: Variables,
            options: Options,
        ) => {
            const { gqlQueryString, variableValues, headers } = prepareGqlRequest(
                'mutation',
                mutationName,
                responseQuery,
                variables,
                options,
            )
            return gqlRequest(gqlQueryString, variableValues, headers)
        },
    }
}

export type TestingInterfaceApp = Awaited<ReturnType<typeof getTestingInterfaceApp>>

export type TestingRepositories = Awaited<ReturnType<typeof getTestingInterfaceApp>>['repositories']

interface Options {
    headers?: IncomingHttpHeaders
}

type Variables = Record<
    string,
    {
        type: string
        value: unknown
    }
>
