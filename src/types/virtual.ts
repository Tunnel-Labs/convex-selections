export type Virtual<$TableName extends string> =
	| `__VIRTUAL__:${$TableName}`
	| undefined
	| null;
export type VirtualArray<$TableName extends string> =
	| `__VIRTUAL__:${$TableName}`[]
	| undefined
	| null;
