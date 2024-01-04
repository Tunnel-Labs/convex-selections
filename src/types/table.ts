import {
	type GenericTableIndexes,
	type GenericTableSearchIndexes,
	type GenericTableVectorIndexes,
	TableDefinition
} from 'convex/server';
import type { Validator } from 'convex/values';

export interface Table<
	$TableName extends string = string,
	$DocumentSchema extends Validator<any, any, any> = Validator<any, any, any>,
	_$TableIndexes extends GenericTableIndexes = GenericTableIndexes,
	_$SearchIndexes extends GenericTableSearchIndexes = GenericTableSearchIndexes,
	_$VectorIndexes extends GenericTableVectorIndexes = GenericTableVectorIndexes
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
