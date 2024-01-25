// dprint-ignore-file
//
import type { GetLabels } from "#types/_.ts";

export type IsTransformed<$Value> =
	'__transformed__' extends GetLabels<NonNullable<$Value>> ?
		true :
	false;

export type TransformedDeprecatedType<$Value> =
	'__deprecatedType__' extends keyof NonNullable<$Value> ?
		NonNullable<NonNullable<$Value>['__deprecatedType__']> |
		(null extends $Value ? null : never) :
	never;