import type { AnyDataModel } from 'convex/server';
import { deepmerge } from 'deepmerge-ts';
import { merge } from 'merge';
import type { Exact, Simplify, UnionToIntersection } from 'type-fest';

import type { ExpandSelections } from '~/types/selections.js';
import type { SelectInputFromDataModel } from '~/types/select.js';

export function expandSelections<
	$SelectionMapping extends Record<string, Record<string, unknown>>
>(selectionMapping: $SelectionMapping): ExpandSelections<$SelectionMapping> {
	function expandInnerSelection(mapping: Record<string, unknown>): void {
		for (const mappingKey of Object.keys(mapping)) {
			if (mappingKey.startsWith('$')) {
				expandInnerSelection(selectionMapping[mappingKey] ?? {});
				Object.assign(mapping, selectionMapping[mappingKey]);
				// eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- We need to delete the key
				delete mapping[mappingKey];
			}
		}
	}

	for (const topLevelMappingValue of Object.values(selectionMapping)) {
		expandInnerSelection(topLevelMappingValue);
	}

	return selectionMapping as any;
}

export function createSelectionFunction<
	$DataModel extends AnyDataModel,
	$TableName extends string,
	$Selections extends Record<string, Record<string, unknown>>
>(
	selections: $Selections
): <
	const $Selection extends Exact<
		SelectInputFromDataModel<$DataModel, $TableName> & {
			[K in keyof $Selections]?: boolean | undefined;
		},
		$Selection
	>
>(
	selection: $Selection
) => Simplify<
	UnionToIntersection<
		{
			[$SelectionKey in keyof $Selection]: $SelectionKey extends `$${string}`
				? ExpandSelections<$Selections>[$SelectionKey]
				: Record<$SelectionKey, $Selection[$SelectionKey]>;
		}[keyof $Selection]
	>
> {
	const expandedSelections = expandSelections(selections);

	return function select(selection) {
		const selectionsArray: any[] = [];

		for (const [selectionKey, selectionValue] of Object.entries(selection)) {
			if (selectionKey.startsWith('$')) {
				selectionsArray.push((expandedSelections as any)[selectionKey]);
			} else {
				selectionsArray.push({ [selectionKey]: selectionValue });
			}
		}

		return deepmerge(...selectionsArray) as any;
	};
}

export function combineSelections<
	Selections extends Array<Record<string, any>>
>(...selections: Selections): UnionToIntersection<Selections[number]> {
	return merge(...selections);
}
