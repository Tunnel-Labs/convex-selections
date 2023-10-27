import { Validator } from 'convex/values';

export type Relation<$TableName extends string> = Validator<
	`__RELATION__:${$TableName}` | undefined,
	true,
	never
>;
export type RelationArray<$TableName extends string> = Validator<
	`__RELATION__:${$TableName}`[] | undefined,
	true,
	never
>;
