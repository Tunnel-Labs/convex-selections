import { v } from 'convex/values';

export function vRelation(foreignTableName: string) {
	return v.optional(v.literal(`__RELATION__:${foreignTableName}`));
}

export function vRelationArray(foreignTableName: string) {
	return v.optional(v.array(v.literal(`__RELATION__:${foreignTableName}`)));
}
