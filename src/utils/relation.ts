import { Validator, v } from 'convex/values';

export function vRelation<$TableName extends string>(
	foreignTableName: $TableName
): Validator<`__RELATION__:${$TableName}` | undefined, true, never> {
	return Object.assign(v.optional(v.any()), { __relation__: true }) as any;
}

export function vRelationArray<$TableName extends string>(
	foreignTableName: $TableName
): Validator<`__RELATION__:${$TableName}`[] | undefined, true, never> {
	return Object.assign(v.optional(v.any()), { __relationArray__: true }) as any;
}
