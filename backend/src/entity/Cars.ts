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
 * Schema for cars entity
 */
export const carsSchema = TypeBox.Type.Object({
    id: TypeBox.Type.String({ format: 'uuid' }),

        model: TypeBox.Type.String({ default: '' }),

});

/**
 * Schema for creating a new cars
 */
export const newCarsSchema = TypeBox.Type.Omit(
    carsSchema,
    // remove metadata fields
    ['id'],
    { additionalProperties: false },
);

@Entity()
export class Cars implements TypeBox.Static<typeof carsSchema> {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

        @Column({ default: '' })
        model!: string;

}
