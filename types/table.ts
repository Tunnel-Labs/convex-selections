import type {
	DeprecatedDocument,
	IsComputed,
	IsNew,
	IsRelation,
	IsTransformed,
	IsVirtual,
	IsVirtualArray,
	SetTableIndexes,
	UnwrapLabeled,
} from '#types';
import type {
	AnyDataModel,
	GenericQueryCtx,
	GenericTableIndexes,
	GenericTableSearchIndexes,
	GenericTableVectorIndexes,
	TableDefinition,
} from 'convex/server';
import type { GenericId, Infer, Validator } from 'convex/values';

// dprint-ignore
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
		{ default?: (document: any) => any } |
		// Virtual relations
		{
			foreignTable: string;
			foreignIndex: string;
			type: 'virtual' | 'virtualArray';
		} |
		// ID relations
		{
			foreignTable: string;
			hostIndex: string;
			onDelete: 'Cascade' | 'Restrict' | 'SetNull';
		}
	>;
	setTableIndexes: (table: TableDefinition) => TableDefinition;
}

// dprint-ignore
type ShouldFieldHaveConfiguration<
	$DocumentSchema extends Validator<Record<string, any>, false, any>,
	$Field extends keyof Infer<$DocumentSchema>
> =
	IsComputed<Infer<$DocumentSchema>[$Field]> |
	IsNew<Infer<$DocumentSchema>[$Field]> |
	IsRelation<Infer<$DocumentSchema>[$Field]> |
	IsTransformed<Infer<$DocumentSchema>[$Field]>

// dprint-ignore
export type TableConfiguration<
	_$TableName extends string,
	$DocumentSchema extends Validator<Record<string, any>, false, any>,
	$SetTableIndexes extends SetTableIndexes<$DocumentSchema>,
> = {
	[
		$Field in keyof Infer<$DocumentSchema> as
			ShouldFieldHaveConfiguration<$DocumentSchema, $Field> extends true ?
				$Field :
			never
	]-?:
		(
			IsComputed<Infer<$DocumentSchema>[$Field]> extends true ?
				{
					computed(
						ctx: GenericQueryCtx<AnyDataModel>,
						document: Infer<$DocumentSchema>,
					):
						UnwrapLabeled<NonNullable<Infer<$DocumentSchema>[$Field]>> |
						(null extends Infer<$DocumentSchema>[$Field] ? null : never);
				}
				: {}
		) &
		(
			IsNew<Infer<$DocumentSchema>[$Field]> extends true ?
				{
					default(
						document: DeprecatedDocument<Infer<$DocumentSchema>>,
					): Exclude<Infer<$DocumentSchema>[$Field], undefined>;
				} :
			{}
		) &
		(
			IsTransformed<Infer<$DocumentSchema>[$Field]> extends true ?
				{
					transform(document:
						DeprecatedDocument<Infer<$DocumentSchema>> &
						// Making sure the field to be transformed is present on the type (it might be wrapped in a `vNew` and thus might not be present in the `DeprecatedDocument` type
						Record<$Field, Infer<$DocumentSchema>[$Field]>
					): Infer<$DocumentSchema>[$Field];
					isDeprecated(
						document: Infer<$DocumentSchema> | DeprecatedDocument<Infer<$DocumentSchema>>
					): boolean
				} :
			{}
		) &
		(
			NonNullable<Infer<$DocumentSchema>[$Field]> extends GenericId<infer $ForeignTableName> ?
				{
					foreignTable: $ForeignTableName;
					hostIndex: ReturnType<$SetTableIndexes> extends
						TableDefinition<any, any, infer $Indexes> ? keyof $Indexes
						: never;
					onDelete: 'Cascade' | 'Restrict' | 'SetNull';
				} :
			IsVirtual<Infer<$DocumentSchema>[$Field]> extends true ?
				{
					foreignIndex: string;
					foreignTable: UnwrapLabeled<
						NonNullable<Infer<$DocumentSchema>[$Field]>
					>;
					type: 'virtual';
				} :
			IsVirtualArray<Infer<$DocumentSchema>[$Field]> extends true ?
				{
					foreignIndex: string;
					foreignTable: UnwrapLabeled<
						NonNullable<Infer<$DocumentSchema>[$Field]>
					>;
					type: 'virtualArray';
				} :
			{}
		);
};
