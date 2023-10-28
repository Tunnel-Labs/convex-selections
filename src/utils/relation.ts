import { v } from 'convex/values';
import { GetIndexesFromTable } from '~/types/index.js';

export function vRelation<$ForeignTable>(foreignTableName: string) {
	return {
		withIndex<
			$Index extends keyof GetIndexesFromTable<$ForeignTable> & string,
			$IndexFields extends GetIndexesFromTable<$ForeignTable>[$Index]
		>(index: $Index, indexFields: $IndexFields) {
			return v.optional(
				v.literal(
					`__RELATION__:${foreignTableName}:${foreignTableName}:${index}:${indexFields.join(
						','
					)}`
				)
			);
		}
	};
}

export function vRelationArray<$ForeignTable>(foreignTableName: string) {
	return {
		withIndex<
			$Index extends keyof GetIndexesFromTable<$ForeignTable> & string,
			$IndexFields extends GetIndexesFromTable<$ForeignTable>[$Index],
			$IndexFieldsWithoutLast extends $IndexFields extends [
				...infer $IndexFieldsWithoutLast,
				infer _$LastIndexField
			]
				? $IndexFieldsWithoutLast
				: never
		>(index: $Index, indexFields: $IndexFieldsWithoutLast) {
			return v.optional(
				v.array(
					v.literal(
						`__RELATION__:${foreignTableName}:${foreignTableName}:${index}:${indexFields.join(
							','
						)}`
					)
				)
			);
		}
	};
}
