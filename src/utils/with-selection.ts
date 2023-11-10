import { sha256 } from 'sha-anything';
import type {
	SelectInputFromDataModel,
	SelectOutputFromDataModel
} from '~/types/select.js';
import type { TableNameFromProcedureCallback } from '~/types/schema.js';
import type { ProcedureReturnType } from '~/types/procedure.js';

export function createWithSelection<$DataModel>({
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
		const selectionHash = await sha256(selection);
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
