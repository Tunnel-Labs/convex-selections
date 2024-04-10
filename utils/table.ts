import type { SetTableIndexes, Table, TableConfiguration } from '#types';
import type { TableDefinition } from 'convex/server';
import type { Validator } from 'convex/values';

// dprint-ignore
export function table<
	$TableName extends string,
	$DocumentSchema extends Validator<Record<string, any>, false, any>,
	$SetTableIndexes extends SetTableIndexes<$DocumentSchema>
>(
	tableName: $TableName,
	documentSchema: $DocumentSchema,
	setTableIndexes: $SetTableIndexes,
): (
	config: TableConfiguration<$TableName, $DocumentSchema, $SetTableIndexes>
) =>
	ReturnType<$SetTableIndexes> extends TableDefinition<any, any, infer $Indexes, infer $SearchIndexes, infer $VectorIndexes> ?
		Table<
			$TableName,
			$DocumentSchema,
			$Indexes,
			$SearchIndexes,
			$VectorIndexes
		> :
	never;
export function table(
	tableName: string,
	documentSchema: Validator<Record<string, any>, false, any>,
	setTableIndexes: (table: TableDefinition) => TableDefinition,
): (configuration: Record<string, any>) => Table {
	return (configuration) => {
		// @ts-expect-error: Custom property
		table.onDelete ??= new Map();

		for (const [field, fieldValue] of Object.entries(configuration)) {
			if (!('onDelete' in fieldValue)) continue;

			// We treat the current table as the table that is affected by the deletion
			const affectedTableName = tableName;
			const { foreignTable, hostIndex, onDelete } = fieldValue;
			// @ts-expect-error: Custom property
			if (!table.onDelete.has(foreignTable)) {
				// @ts-expect-error: Custom property
				table.onDelete.set(foreignTable, {});
			}

			// When the foreign table is deleted, the affected table
			// @ts-expect-error: Custom property
			table.onDelete.get(foreignTable)[affectedTableName] = {
				action: onDelete,
				affectedFieldIndex: hostIndex,
				affectedField: field,
			};
		}

		return {
			tableName,
			schema: documentSchema,
			configuration,
			setTableIndexes,
		};
	};
}
