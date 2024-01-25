import type {
	AnyDocumentSchema,
	ExtractDocument,
	ExtractFieldPaths,
} from '#types/_.ts';
import type { TableDefinition } from 'convex/server';

export type GetIndexesFromTable<$Table> = $Table extends TableDefinition<
	any,
	any,
	infer $Indexes,
	any,
	any
> ? $Indexes
	: never;

export type SetTableIndexes<$DocumentSchema extends AnyDocumentSchema> = (
	tableDefinition: TableDefinition<
		ExtractDocument<$DocumentSchema>,
		ExtractFieldPaths<$DocumentSchema>
	>,
) => TableDefinition;
