import type { TableDefinition } from 'convex/server';
import type { GenericId, Infer } from 'convex/values';
import type { Validator } from 'convex/values';

import type { ExtractDocument, ExtractFieldPaths } from '../types/convex.js';
import type { UnwrapTagged } from '../types/tagged.js';
import type { Table } from '../types/table.ts';
import type { IsVirtual, IsVirtualArray } from '../types/virtual.js';
import type { IsNew } from '../types/variant.js';

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
	config: {
		[
			$Field in keyof Infer<$DocumentSchema> as
				NonNullable<Infer<$DocumentSchema>[$Field]> extends GenericId<string> ?
					$Field :
				IsVirtual<NonNullable<Infer<$DocumentSchema>[$Field]>> extends true ?
					$Field :
				IsVirtualArray<NonNullable<Infer<$DocumentSchema>[$Field]>> extends true ?
					$Field :
				IsNew<NonNullable<Infer<$DocumentSchema>[$Field]>> extends true ?
					$Field :
				never
		]:
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
					foreignTable: UnwrapTagged<NonNullable<Infer<$DocumentSchema>[$Field]>>,
					type: 'virtual'
				} :
			IsVirtualArray<NonNullable<Infer<$DocumentSchema>[$Field]>> extends true ?
				{
					foreignIndex: string,
					foreignTable: UnwrapTagged<NonNullable<Infer<$DocumentSchema>[$Field]>>,
					type: 'virtualArray'
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
): (relations: Record<string, any>) => Table {
	return (relations) => {
		// @ts-expect-error: Custom property
		table.onDelete ??= new Map();

		for (const [field, fieldValue] of Object.entries(relations)) {
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
			relations,
			setTableIndexes
		};
	};
}
