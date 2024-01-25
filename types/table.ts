import type {
	DeprecatedDocument,
	IsId,
	IsNew,
	IsRelation,
	IsTransformed,
	IsVirtual,
	IsVirtualArray,
	SetTableIndexes,
	UnwrapLabeled,
} from '#types/_.ts';
import {
	type GenericTableIndexes,
	type GenericTableSearchIndexes,
	type GenericTableVectorIndexes,
	TableDefinition,
} from 'convex/server';
import type { GenericId, Infer, Validator } from 'convex/values';

export interface Table<
	$TableName extends string = string,
	$DocumentSchema extends Validator<any, any, any> = Validator<any, any, any>,
	_$TableIndexes extends GenericTableIndexes = GenericTableIndexes,
	_$SearchIndexes extends GenericTableSearchIndexes = GenericTableSearchIndexes,
	_$VectorIndexes extends GenericTableVectorIndexes = GenericTableVectorIndexes,
> {
	tableName: $TableName;
	schema: $DocumentSchema;
	configuration: Record<
		string,
		| { default?: (document: any) => any }
		// Virtual relations
		| {
			foreignTable: string;
			foreignIndex: string;
			type: 'virtual' | 'virtualArray';
		}
		// ID relations
		| {
			foreignTable: string;
			hostIndex: string;
			onDelete: 'Cascade' | 'Restrict' | 'SetNull';
		}
	>;
	setTableIndexes: (table: TableDefinition) => TableDefinition;
}

export type TableConfiguration<
	_$TableName extends string,
	$DocumentSchema extends Validator<Record<string, any>, false, any>,
	$SetTableIndexes extends SetTableIndexes<$DocumentSchema>,
> = {
	[
		$Field in keyof Infer<
			$DocumentSchema
		> as IsRelation<Infer<$DocumentSchema>[$Field]> extends true ? $Field
			: IsTransformed<Infer<$DocumentSchema>[$Field]> extends true ? $Field
			: never
	]-?:
		& (
			IsTransformed<Infer<$DocumentSchema>[$Field]> extends true ? {
					transform(
						document: DeprecatedDocument<Infer<$DocumentSchema>>,
					): Infer<$DocumentSchema>[$Field];
				}
				: {}
		)
		& (
			IsNew<Infer<$DocumentSchema>[$Field]> extends true ? {
					default(
						document: DeprecatedDocument<Infer<$DocumentSchema>>,
					): Exclude<Infer<$DocumentSchema>[$Field], undefined>;
				}
				: {}
		)
		& NonNullable<Infer<$DocumentSchema>[$Field]> extends GenericId<infer $ForeignTableName> ? {
			foreignTable: $ForeignTableName;
			hostIndex: ReturnType<$SetTableIndexes> extends
				TableDefinition<any, any, infer $Indexes> ? keyof $Indexes
				: never;
			onDelete: 'Cascade' | 'Restrict' | 'SetNull';
		}
		: IsVirtual<Infer<$DocumentSchema>[$Field]> extends true ? {
				foreignIndex: string;
				foreignTable: UnwrapLabeled<
					NonNullable<Infer<$DocumentSchema>[$Field]>
				>;
				type: 'virtual';
			}
		: IsVirtualArray<Infer<$DocumentSchema>[$Field]> extends true ? {
				foreignIndex: string;
				foreignTable: UnwrapLabeled<
					NonNullable<Infer<$DocumentSchema>[$Field]>
				>;
				type: 'virtualArray';
			}
		: {};
};
