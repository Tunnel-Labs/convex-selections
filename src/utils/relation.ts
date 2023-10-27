import { v } from 'convex/values';
import type { Relation, RelationArray } from '~/types/relation.js';

export function vRelation<$ForeignTableName extends string, $ForeignProperty>(
	foreignTableName: $ForeignTableName,
	_foreignProperty: $ForeignProperty
): Relation<$ForeignTableName> {
	return v.optional(v.literal(`__RELATION__:${foreignTableName}`));
}

export function vRelationArray<
	$ForeignTableName extends string,
	$ForeignProperty
>(
	foreignTableName: $ForeignTableName,
	_foreignProperty: $ForeignProperty
): RelationArray<$ForeignTableName> {
	return v.optional(v.array(v.literal(`__RELATION__:${foreignTableName}`)));
}
