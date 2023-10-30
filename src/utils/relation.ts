import { Validator, v } from 'convex/values';

// v.optional(v.union(v.literal(...), v.null()))
export function vRelation<$TableName extends string>(
	foreignTableName: $TableName,
	options: { nullable: true }
): Validator<`__RELATION__:${$TableName}` | null | undefined, true, never>;
export function vRelation<$TableName extends string>(
	foreignTableName: $TableName
): Validator<`__RELATION__:${$TableName}` | undefined, true, never>;
export function vRelation(foreignTableName: string): any {
	return Object.assign(v.optional(v.any()), { __relation__: true }) as any;
}

export function vRelationArray<$TableName extends string>(
	foreignTableName: $TableName
): Validator<`__RELATION__:${$TableName}`[] | undefined, true, never> {
	return Object.assign(v.optional(v.any()), { __relationArray__: true }) as any;
}
