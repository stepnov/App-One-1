import { FastifyInstance } from 'fastify'
import { getCustomRepository } from 'typeorm';
import * as TypeBox from '@sinclair/typebox';

import { CarsRepository } from '../repository/CarsRepository';
import { newCarsSchema, carsSchema } from '../entity/Cars';

export const tag = 'Cars';

export default async (app: FastifyInstance) => {
    const schema = TypeBox.Type.Object({
        q: TypeBox.Type.Optional(TypeBox.Type.Partial(carsSchema, { description: 'Filter query', additionalProperties: false })),
        page: TypeBox.Type.Number({ default: 1, minimum: 1, description: 'Page number' }),
        limit: TypeBox.Type.Number({ minimum: 0, maximum: 20, default: 10, description: 'Page size' }),
    }, {
        style: 'deepObject',
    });

    app.get<{ Querystring: TypeBox.Static<typeof schema> }>('/cars', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAuthorized]),
        schema: {
            querystring: schema,
            security: [{
                bearerAuth: [],
            }],
            tags: [tag],
            summary: 'List cars',
        },
    }, async (req) => {
        // @ts-ignore
        const [items, count] = await getCustomRepository(CarsRepository).filter(req.query.q, req.query.page, req.query.limit);
        return {
            rows: items,
            count,
            isLastPage: (req.query.page + 1) * req.query.limit >= count,
        };
    });

    const postPayload = TypeBox.Type.Object({
        data: newCarsSchema,
    });
    app.post<{
        Body: TypeBox.Static<typeof postPayload>,
        Reply: TypeBox.Static<typeof carsSchema>
    }>('/cars', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAuthorized]),
        schema: {
            security: [{
                bearerAuth: [],
            }],
            tags: [tag],
            summary: 'Create new cars',
            body: postPayload,
            response: {
                200: carsSchema,
                400: TypeBox.Type.Object({
                    statusCode: TypeBox.Type.Number({ default: 400 }),
                    error: TypeBox.Type.Optional(TypeBox.Type.String()),
                    message: TypeBox.Type.String(),
                }, { description: 'Validation error' }),
            },
        },
    }, async (req, reply) => {
        const repo = getCustomRepository(CarsRepository);
        return repo.save(req.body.data);
    });

    const find = TypeBox.Type.Object({
        id: TypeBox.Type.String({
            format: 'uuid',
        }),
    });

    app.get<{
        Params: TypeBox.Static<typeof find>,
        Reply: TypeBox.Static<typeof carsSchema>
    }>('/cars/:id', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAuthorized]),
        schema: {
            params: find,
            tags: [tag],
            summary: 'Get specific cars',
            security: [{
                bearerAuth: [],
            }],
            response: {
                200: carsSchema,
                404: TypeBox.Type.Object({
                    statusCode: TypeBox.Type.Number({ default: 404 }),
                    error: TypeBox.Type.String({ default: 'Not Found' }),
                    message: TypeBox.Type.String(),
                }, { description: 'Cars not found' }),
            },
        }
    // @ts-ignore
    }, async (req, reply) => {
        const entity = await getCustomRepository(CarsRepository).findOne({
            where: {
                id: req.params.id,
            },
        });

        return entity ? entity : reply.notFound('Cars not found');
    });

    const putSchema = TypeBox.Type.Object({
        id: TypeBox.Type.String({ format: 'uuid' }),
        data: TypeBox.Type.Partial(newCarsSchema),
    });
    app.put<{
        Params: TypeBox.Static<typeof find>,
        Body: TypeBox.Static<typeof putSchema>,
    }>('/cars/:id', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAdmin]),
        schema: {
            summary: 'Edit existing cars',
            params: find,
            body: putSchema,
            tags: [tag],
            security: [{
                bearerAuth: [],
            }],
        }
    }, async (req, reply) => {
        return getCustomRepository(CarsRepository).save({
            ...req.body.data,
            id: req.params.id,
        });
    });

    app.delete<{
        Params: TypeBox.Static<typeof find>,
    }>('/cars/:id', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAdmin]),
        schema: {
            description: 'Delete cars',
            summary: 'Delete cars',
            params: find,
            tags: [tag],
            security: [{
                bearerAuth: [],
            }],
            response: {
                200: {
                    description: 'cars successfully deleted',
                    type: 'null',
                },
                404: TypeBox.Type.Object({
                    statusCode: TypeBox.Type.Number({ default: 404 }),
                    error: TypeBox.Type.String({ default: 'Not Found' }),
                    message: TypeBox.Type.String(),
                }, { description: 'cars not found' }),
            },
        }
    }, async (req, reply) => {
        const entity = await getCustomRepository(CarsRepository).softDelete(req.params.id);
        if (!entity.affected) {
            reply.notFound('cars not found');
            return;
        }

        reply.code(200).send();
    });
}
