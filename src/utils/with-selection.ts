import { AnyDataModel } from 'convex/server';
import { sha256 } from 'js-sha256';
import sortKeys from 'sort-keys';

import type { ProcedureReturnType } from '~/types/procedure.js';
import type { TableNameFromProcedureCallback } from '~/types/schema.js';
import type {
	SelectInputFromDataModel,
	SelectOutputFromDataModel
} from '~/types/select.js';

export function createWithSelection<$DataModel extends AnyDataModel>({
	selectionHashes
}: {
	selectionHashes: Record<string, unknown>;
}): <
	$ProcedureCallback extends (selection: string) => any,
	const Selection extends SelectInputFromDataModel<
		$DataModel,
		TableNameFromProcedureCallback<$DataModel, $ProcedureCallback>
	>
>(
	cb: $ProcedureCallback,
	selection: Selection
) => Promise<
	| (ProcedureReturnType<$ProcedureCallback> extends Array<any>
			? SelectOutputFromDataModel<
					$DataModel,
					TableNameFromProcedureCallback<$DataModel, $ProcedureCallback>,
					Selection
			  >[]
			: SelectOutputFromDataModel<
					$DataModel,
					TableNameFromProcedureCallback<$DataModel, $ProcedureCallback>,
					Selection
			  >)
	| (null extends ProcedureReturnType<$ProcedureCallback> ? null : never)
> {
	return async function withSelection(cb: any, selection: any): Promise<any> {
		const selectionHash = sha256(
			JSON.stringify(sortKeys(selection, { deep: true }))
		);
		if (selectionHashes[selectionHash] === undefined) {
			// eslint-disable-next-line no-console -- bruh
			console.error(
				'Selection not found in selectionHashes',
				selection,
				`(hash: ${selectionHash})`
			);
			throw new Error(
				`Selection hash ${selectionHash} not found in selectionHashes`
			);
		}

		return cb(selectionHash);
	};
}
