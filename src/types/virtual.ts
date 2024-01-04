import type { Tagged } from '~/types/tagged.js';

export type Virtual<$TableName extends string> =
	| Tagged<$TableName, '__virtual__'>
	| undefined
	| null;
export type VirtualArray<$TableName extends string> =
	| Tagged<$TableName, '__virtualArray__'>
	| undefined
	| null;
