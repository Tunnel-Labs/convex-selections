import { TableDefinition } from 'convex/server';

export type GetIndexesFromTable<$Table> = $Table extends TableDefinition<
	any,
	any,
	infer $Indexes,
	any,
	any
>
	? $Indexes
	: never;
