import type { Table } from "#types/$.ts";

export function virtual<$ForeignTable extends Table<any, any, any>>(
	foreignTable: $ForeignTable extends Table<infer $TableName, any, any>
		? $TableName
		: never,
	foreignIndex: $ForeignTable extends Table<any, any, infer $TableIndexes>
		? keyof $TableIndexes
		: never,
) {
	return {
		foreignTable,
		foreignIndex,
		type: "virtual",
	} as const;
}

export function virtualArray<$ForeignTable extends Table<any, any, any>>(
	foreignTable: $ForeignTable extends Table<infer $TableName, any, any>
		? $TableName
		: never,
	foreignIndex: $ForeignTable extends Table<any, any, infer $TableIndexes>
		? keyof $TableIndexes
		: never,
) {
	return {
		foreignTable,
		foreignIndex,
		type: "virtualArray",
	} as const;
}
