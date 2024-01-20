import type { GetTags } from '../types/tagged.js';

export type IsExcluded<$Value> = '__excluded__' extends GetTags<NonNullable<$Value>>
	? true
	: false;