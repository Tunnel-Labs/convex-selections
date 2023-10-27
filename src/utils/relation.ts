import { v } from 'convex/values';

export function vRelation<$ForeignTableName extends string, $ForeignProperty>(
	foreignTableName: $ForeignTableName,
	_foreignProperty: $ForeignProperty
) {
	return v.optional(v.literal(`__RELATION__:${foreignTableName}`));
}

export function vRelationArray<
	$ForeignTableName extends string,
	$ForeignProperty
>(foreignTableName: $ForeignTableName, _foreignProperty: $ForeignProperty) {
	return v.optional(v.array(v.literal(`__RELATION__:${foreignTableName}`)));
}
