import type { TableDefinition } from 'convex/server';
import type { GenericId, Infer } from 'convex/values';
import type { Validator } from 'convex/values';
import type { IsAny } from 'type-fest';

import type { ExtractDocument, ExtractFieldPaths } from '~/types/convex.js';
import type { Table } from '~/types/table.ts';
import type { Virtual, VirtualArray } from '~/types/virtual.js';

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
	relations: {
		[
			$Field in keyof Infer<$DocumentSchema> as
				NonNullable<Infer<$DocumentSchema>[$Field]> extends GenericId<string> ?
					$Field :
				NonNullable<Infer<$DocumentSchema>[$Field]> extends Virtual<string> ?
					$Field :
				NonNullable<Infer<$DocumentSchema>[$Field]> extends Array<infer $Item> ?
					IsAny<$Item> extends true ?
						never :
					NonNullable<Infer<$DocumentSchema>[$Field]> extends VirtualArray<string> ?
						$Field :
					never :
				never
		]:
			NonNullable<Infer<$DocumentSchema>[$Field]> extends GenericId<infer $TableName> ?
				{
					foreignTable: $TableName,
					hostIndex:
						ReturnType<$SetTableIndexes> extends TableDefinition<any, any, infer $Indexes> ?
							keyof $Indexes :
						never,
					onDelete: 'Cascade' | 'Restrict' | 'SetNull'
				} :
			NonNullable<Infer<$DocumentSchema>[$Field]> extends Virtual<infer $TableName> ?
				{ foreignIndex: string, foreignTable: $TableName, type: 'virtual' } :
			NonNullable<Infer<$DocumentSchema>[$Field]> extends Array<infer $Item> ?
				IsAny<$Item> extends true ?
					never :
				NonNullable<Infer<$DocumentSchema>[$Field]> extends VirtualArray<infer $TableName> ?
					{ foreignIndex: string, foreignTable: $TableName, type: 'virtualArray' } :
				never :
			never
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
	return (relations) => ({
		tableName,
		schema: documentSchema,
		relations,
		setTableIndexes
	});
}
