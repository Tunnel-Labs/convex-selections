import type { TableDefinition } from 'convex/server';
import type { GenericId, Infer } from 'convex/values';
import type { Validator } from 'convex/values';

import type { ExtractDocument, ExtractFieldPaths } from '../types/convex.js';
import type { UnwrapLabeled } from '../types/labeled.js';
import type { Table } from '../types/table.ts';
import type { IsVirtual, IsVirtualArray } from '../types/virtual.js';
import type { IsNew, PickDeprecated } from '../types/variant.js';
import { Get } from 'type-fest';

// prettier-ignore
export function table<
	$TableName extends string,
	$DocumentSchema extends Validator<Record<string, any>, false, any>,
	$SetTableIndexes extends (
		tableDefinition: TableDefinition<
			ExtractDocument<$DocumentSchema>,
			ExtractFieldPaths<$DocumentSchema>
		>
	) => TableDefinition,
>(
	tableName: $TableName,
	documentSchema: $DocumentSchema,
	setTableIndexes: $SetTableIndexes,
): (
	config:
		// Top-level fields
		{
			[
				$Field in keyof Infer<$DocumentSchema> as
					NonNullable<Infer<$DocumentSchema>[$Field]> extends GenericId<string> ?
						$Field :
					IsVirtual<NonNullable<Infer<$DocumentSchema>[$Field]>> extends true ?
						$Field :
					IsVirtualArray<NonNullable<Infer<$DocumentSchema>[$Field]>> extends true ?
						$Field :
					never
			]-?:
				(
					IsNew<Infer<$DocumentSchema>[$Field]> extends true ?
						{
							default: (document: Infer<$DocumentSchema>) => Exclude<Infer<$DocumentSchema>[$Field], undefined>
						} :
					{}
				) &
				NonNullable<Infer<$DocumentSchema>[$Field]> extends GenericId<infer $TableName> ?
					{
						foreignTable: $TableName,
						hostIndex:
							ReturnType<$SetTableIndexes> extends TableDefinition<any, any, infer $Indexes> ?
								keyof $Indexes :
							never,
						onDelete: 'Cascade' | 'Restrict' | 'SetNull'
					} :
				IsVirtual<NonNullable<Infer<$DocumentSchema>[$Field]>> extends true ?
					{
						foreignIndex: string,
						foreignTable: UnwrapLabeled<NonNullable<Infer<$DocumentSchema>[$Field]>>,
						type: 'virtual'
					} :
				IsVirtualArray<NonNullable<Infer<$DocumentSchema>[$Field]>> extends true ?
					{
						foreignIndex: string,
						foreignTable: UnwrapLabeled<NonNullable<Infer<$DocumentSchema>[$Field]>>,
						type: 'virtualArray'
					} :
				{}
		} &
		// All field paths that contain `vNew`
		{
			[
				$FieldPath in ExtractFieldPaths<$DocumentSchema> as
					$FieldPath extends '_creationTime' ?
						never :
					IsNew<Get<Infer<$DocumentSchema>, $FieldPath>> extends true ?
						$FieldPath :
					never
			]-?:
				IsNew<Get<Infer<$DocumentSchema>, $FieldPath>> extends true ?
					{
						default: (document: PickDeprecated<Infer<$DocumentSchema>>) => Exclude<Get<Infer<$DocumentSchema>, $FieldPath>, undefined>
					} :
				{}
		}
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
	setTableIndexes: (table: TableDefinition) => TableDefinition
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
				affectedField: field
			};
		}

		return {
			tableName,
			schema: documentSchema,
			configuration,
			setTableIndexes
		};
	};
}
