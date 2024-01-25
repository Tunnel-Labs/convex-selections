import type { GetLabels } from "#types/_.ts";

// dprint-ignore
export type IsExcluded<$Value> =
	'__excluded__' extends GetLabels<NonNullable<$Value>> ?
		true :
	 false;
