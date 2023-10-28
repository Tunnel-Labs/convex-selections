export type Relation<$TableName extends string> =
	| `__RELATION__:${$TableName}`
	| undefined;
export type RelationArray<$TableName extends string> =
	| `__RELATION__:${$TableName}`[]
	| undefined;
