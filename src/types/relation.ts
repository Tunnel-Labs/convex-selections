export type Relation<$TableName extends string> =
	| `__RELATION__:${$TableName}`
	| undefined
	| null;
export type RelationArray<$TableName extends string> =
	| `__RELATION__:${$TableName}`[]
	| undefined
	| null;
