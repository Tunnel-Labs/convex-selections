import { Validator, v } from 'convex/values';

// v.optional(v.union(v.literal(...), v.null()))
export function vVirtual<$TableName extends string>(
	foreignTableName: $TableName,
	options: { nullable: true }
): Validator<`__RELATION__:${$TableName}` | null | undefined, true, never>;
export function vVirtual<$TableName extends string>(
	foreignTableName: $TableName
): Validator<`__RELATION__:${$TableName}` | undefined, true, never>;
export function vVirtual(foreignTableName: string): any {
	return Object.assign(v.optional(v.any()), { __relation__: true }) as any;
}

export function vVirtualArray<$TableName extends string>(
	foreignTableName: $TableName
): Validator<`__RELATION__:${$TableName}`[] | undefined, true, never> {
	return Object.assign(v.optional(v.any()), { __relationArray__: true }) as any;
}
