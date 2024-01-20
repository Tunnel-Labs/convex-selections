import type { GetLabels, Labeled } from '../types/Labeled.js';

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
