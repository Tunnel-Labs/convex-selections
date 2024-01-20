import type { GetLabels } from '../types/labeled.js';

export type IsExcluded<$Value> = '__excluded__' extends GetLabels<NonNullable<$Value>>
	? true
	: false;