import type { GetTags, Tagged } from '~/types/tagged.js';

export type Virtual<$TableName extends string> =
	| Tagged<$TableName, '__virtual__'>
	| undefined
	| null;
export type VirtualArray<$TableName extends string> =
	| Tagged<$TableName, '__virtualArray__'>
	| undefined
	| null;

export type IsVirtual<$Value> = '__virtual__' extends GetTags<$Value>
	? true
	: false;

export type IsVirtualArray<$Value> = '__virtualArray__' extends GetTags<$Value>
	? true
	: false;
