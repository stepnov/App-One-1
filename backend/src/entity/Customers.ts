import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
    CreateDateColumn,
    UpdateDateColumn,

} from 'typeorm';
import * as TypeBox from '@sinclair/typebox';

/**
 * Schema for customers entity
 */
export const customersSchema = TypeBox.Type.Object({
    id: TypeBox.Type.String({ format: 'uuid' }),

        field: TypeBox.Type.String({ default: '' }),

});

/**
 * Schema for creating a new customers
 */
export const newCustomersSchema = TypeBox.Type.Omit(
    customersSchema,
    // remove metadata fields
    ['id'],
    { additionalProperties: false },
);

@Entity()
export class Customers implements TypeBox.Static<typeof customersSchema> {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

        @Column({ default: '' })
        field!: string;

}
