import { EntityRepository, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dayjs from 'dayjs';

import { Cars } from '../entity/Cars';
import { applyFilters, EntityQuery } from './utils';

@EntityRepository(Cars)
export class CarsRepository extends Repository<Cars> {

    filter(query: EntityQuery<Cars> | undefined, page: number, size: number): Promise<[Cars[], number]> {
        const qb = this.createQueryBuilder('e');
        applyFilters(qb, query);
        return qb
            .skip((page - 1) * size)
            .take(size)
            .getManyAndCount();
    }
}
