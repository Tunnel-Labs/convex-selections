import { Validator, v } from 'convex/values';
import type { Labeled } from '../types/labeled.js';

export function vVirtual<$TableName extends string>(
	foreignTableName: $TableName,
	options: { nullable: true }
): Validator<Labeled<$TableName, '__virtual__'> | null | undefined, true, never>;
export function vVirtual<$TableName extends string>(
	foreignTableName: $TableName
): Validator<Labeled<$TableName, '__virtual__'> | undefined, true, never>;
export function vVirtual(foreignTableName: string): any {
	return v.optional(v.any()) as any;
}

export function vVirtualArray<$TableName extends string>(
	foreignTableName: $TableName
): Validator<Labeled<$TableName, `__virtualArray__`> | undefined, true, never> {
	return v.optional(v.any()) as any;
}
