import { v } from 'convex/values';

export function vRelation<$TableName extends string>(foreignTableName: $TableName) {
	return v.optional(v.literal(`__RELATION__:${foreignTableName}`));
}

export function vRelationArray<$TableName extends string>(foreignTableName: $TableName) {
	return v.optional(v.array(v.literal(`__RELATION__:${foreignTableName}`)));
}
