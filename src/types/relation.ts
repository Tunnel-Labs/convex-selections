export type Relation<$TableName extends string> =
	| `__RELATION__:${$TableName}:${string}`
	| undefined;
export type RelationArray<$TableName extends string> =
	| `__RELATION__:${$TableName}:${string}`[]
	| undefined;
