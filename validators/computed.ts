import type { Labeled } from '#types';
import { v, type Validator } from 'convex/values';

export function vComputed<$Type>(): Validator<
	| Labeled<NonNullable<$Type>, '__computed__'>
	| (null extends $Type ? null : never),
	true,
	string
> {
	return v.optional(v.any()) as any;
}
