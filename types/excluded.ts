import type { GetLabels } from "#types/$.ts";

// dprint-ignore
export type IsExcluded<$Value> =
	'__excluded__' extends GetLabels<NonNullable<$Value>> ?
		true :
	 false;
