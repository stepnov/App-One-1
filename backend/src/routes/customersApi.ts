import { FastifyInstance } from 'fastify'
import { getCustomRepository } from 'typeorm';
import * as TypeBox from '@sinclair/typebox';

import { CustomersRepository } from '../repository/CustomersRepository';
import { newCustomersSchema, customersSchema } from '../entity/Customers';

export const tag = 'Customers';

export default async (app: FastifyInstance) => {
    const schema = TypeBox.Type.Object({
        q: TypeBox.Type.Optional(TypeBox.Type.Partial(customersSchema, { description: 'Filter query', additionalProperties: false })),
        page: TypeBox.Type.Number({ default: 1, minimum: 1, description: 'Page number' }),
        limit: TypeBox.Type.Number({ minimum: 0, maximum: 20, default: 10, description: 'Page size' }),
    }, {
        style: 'deepObject',
    });

    app.get<{ Querystring: TypeBox.Static<typeof schema> }>('/customers', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAuthorized]),
        schema: {
            querystring: schema,
            security: [{
                bearerAuth: [],
            }],
            tags: [tag],
            summary: 'List customers',
        },
    }, async (req) => {
        // @ts-ignore
        const [items, count] = await getCustomRepository(CustomersRepository).filter(req.query.q, req.query.page, req.query.limit);
        return {
            rows: items,
            count,
            isLastPage: (req.query.page + 1) * req.query.limit >= count,
        };
    });

    const postPayload = TypeBox.Type.Object({
        data: newCustomersSchema,
    });
    app.post<{
        Body: TypeBox.Static<typeof postPayload>,
        Reply: TypeBox.Static<typeof customersSchema>
    }>('/customers', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAuthorized]),
        schema: {
            security: [{
                bearerAuth: [],
            }],
            tags: [tag],
            summary: 'Create new customers',
            body: postPayload,
            response: {
                200: customersSchema,
                400: TypeBox.Type.Object({
                    statusCode: TypeBox.Type.Number({ default: 400 }),
                    error: TypeBox.Type.Optional(TypeBox.Type.String()),
                    message: TypeBox.Type.String(),
                }, { description: 'Validation error' }),
            },
        },
    }, async (req, reply) => {
        const repo = getCustomRepository(CustomersRepository);
        return repo.save(req.body.data);
    });

    const find = TypeBox.Type.Object({
        id: TypeBox.Type.String({
            format: 'uuid',
        }),
    });

    app.get<{
        Params: TypeBox.Static<typeof find>,
        Reply: TypeBox.Static<typeof customersSchema>
    }>('/customers/:id', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAuthorized]),
        schema: {
            params: find,
            tags: [tag],
            summary: 'Get specific customers',
            security: [{
                bearerAuth: [],
            }],
            response: {
                200: customersSchema,
                404: TypeBox.Type.Object({
                    statusCode: TypeBox.Type.Number({ default: 404 }),
                    error: TypeBox.Type.String({ default: 'Not Found' }),
                    message: TypeBox.Type.String(),
                }, { description: 'Customers not found' }),
            },
        }
    // @ts-ignore
    }, async (req, reply) => {
        const entity = await getCustomRepository(CustomersRepository).findOne({
            where: {
                id: req.params.id,
            },
        });

        return entity ? entity : reply.notFound('Customers not found');
    });

    const putSchema = TypeBox.Type.Object({
        id: TypeBox.Type.String({ format: 'uuid' }),
        data: TypeBox.Type.Partial(newCustomersSchema),
    });
    app.put<{
        Params: TypeBox.Static<typeof find>,
        Body: TypeBox.Static<typeof putSchema>,
    }>('/customers/:id', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAdmin]),
        schema: {
            summary: 'Edit existing customers',
            params: find,
            body: putSchema,
            tags: [tag],
            security: [{
                bearerAuth: [],
            }],
        }
    }, async (req, reply) => {
        return getCustomRepository(CustomersRepository).save({
            ...req.body.data,
            id: req.params.id,
        });
    });

    app.delete<{
        Params: TypeBox.Static<typeof find>,
    }>('/customers/:id', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAdmin]),
        schema: {
            description: 'Delete customers',
            summary: 'Delete customers',
            params: find,
            tags: [tag],
            security: [{
                bearerAuth: [],
            }],
            response: {
                200: {
                    description: 'customers successfully deleted',
                    type: 'null',
                },
                404: TypeBox.Type.Object({
                    statusCode: TypeBox.Type.Number({ default: 404 }),
                    error: TypeBox.Type.String({ default: 'Not Found' }),
                    message: TypeBox.Type.String(),
                }, { description: 'customers not found' }),
            },
        }
    }, async (req, reply) => {
        const entity = await getCustomRepository(CustomersRepository).softDelete(req.params.id);
        if (!entity.affected) {
            reply.notFound('customers not found');
            return;
        }

        reply.code(200).send();
    });
}
