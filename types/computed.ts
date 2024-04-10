import type { GetLabels } from '#types';

// dprint-ignore
export type IsComputed<$Value> =
	'__computed__' extends GetLabels<NonNullable<$Value>> ?
		true :
	false;
