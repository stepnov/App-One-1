import { EntityRepository, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dayjs from 'dayjs';

import { Customers } from '../entity/Customers';
import { applyFilters, EntityQuery } from './utils';

@EntityRepository(Customers)
export class CustomersRepository extends Repository<Customers> {

    filter(query: EntityQuery<Customers> | undefined, page: number, size: number): Promise<[Customers[], number]> {
        const qb = this.createQueryBuilder('e');
        applyFilters(qb, query);
        return qb
            .skip((page - 1) * size)
            .take(size)
            .getManyAndCount();
    }
}
