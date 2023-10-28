import { v } from 'convex/values';
import { GetIndexesFromTable } from '~/types/index.js';

export function vRelation<$ForeignTable>(foreignTableName: string) {
	return {
		withIndex<$Index extends keyof GetIndexesFromTable<$ForeignTable> & string>(
			index: $Index
		) {
			return v.optional(v.literal(`__RELATION__:${foreignTableName}:${index}`));
		}
	};
}

export function vRelationArray<$ForeignTable>(foreignTableName: string) {
	return {
		withIndex<$Index extends keyof GetIndexesFromTable<$ForeignTable> & string>(
			index: $Index
		) {
			return v.optional(
				v.array(v.literal(`__RELATION__:${foreignTableName}:${index}`))
			);
		}
	};
}
