import { Validator, v } from 'convex/values';

// v.optional(v.union(v.literal(...), v.null()))
export function vVirtual<$TableName extends string>(
	foreignTableName: $TableName,
	options: { nullable: true }
): Validator<`__VIRTUAL__:${$TableName}` | null | undefined, true, never>;
export function vVirtual<$TableName extends string>(
	foreignTableName: $TableName
): Validator<`__VIRTUAL__:${$TableName}` | undefined, true, never>;
export function vVirtual(foreignTableName: string): any {
	return Object.assign(v.optional(v.any()), { __virtual__: true }) as any;
}

export function vVirtualArray<$TableName extends string>(
	foreignTableName: $TableName
): Validator<`__VIRTUAL__:${$TableName}`[] | undefined, true, never> {
	return Object.assign(v.optional(v.any()), { __virtualArray__: true }) as any;
}
