// dprint-ignore-file

import type { GenericId } from 'convex/values';
import type { GetLabels, Labeled } from '#types/$.ts';

export type Virtual<$TableName extends string> =
	| Labeled<$TableName, '__virtual__'>
	| undefined
	| null;

export type VirtualArray<$TableName extends string> =
	| Labeled<$TableName, '__virtualArray__'>
	| undefined
	| null;

export type IsVirtual<$Value> = '__virtual__' extends GetLabels<$Value>
	? true
	: false;

export type IsVirtualArray<$Value> = '__virtualArray__' extends GetLabels<$Value>
	? true
	: false;

export type IsId<$Value> = NonNullable<$Value> extends GenericId<string> ? true : false;

export type IsRelation<$Value> =
	IsId<$Value> extends true ?
		true :
	IsVirtual<NonNullable<$Value>> extends true ?
		true :
	IsVirtualArray<NonNullable<$Value>> extends true ?
		true :
	false