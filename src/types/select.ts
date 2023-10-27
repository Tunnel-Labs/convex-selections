import type { GenericId } from 'convex/values';
import type { Relation, RelationArray } from '~/types/relation.js';

// prettier-ignore
export type SelectInputFromDataModel<$DataModel, $TableName extends string> = {
	// @ts-expect-error: works
	[K in keyof $DataModel[$TableName]['document']]?:
		// @ts-expect-error: works
		NonNullable<$DataModel[$TableName]['document'][K]> extends Array<infer $Item> ?
			NonNullable<$Item> extends GenericId<infer $SelectedTableName> ?
				{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName> } :
			NonNullable<$Item> extends RelationArray<infer $SelectedTableName> ?
				{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName> } :
			NonNullable<$Item> extends Relation<infer $SelectedTableName> ?
				{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName> } :
			true :

		// @ts-expect-error: works
		NonNullable<$DataModel[$TableName]['document'][K]> extends GenericId<infer $SelectedTableName> ?
			{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName> } :
		// @ts-expect-error: works
		NonNullable<$DataModel[$TableName]['document'][K]> extends RelationArray<infer $SelectedTableName> ?
			{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName> } :
		// @ts-expect-error: works
		NonNullable<$DataModel[$TableName]['document'][K]> extends Relation<infer $SelectedTableName> ?
			{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName> } :

		true
};

// prettier-ignore
export type SelectOutputFromDataModel<
	$DataModel,
	$TableName extends string,
	$Select extends SelectInputFromDataModel<$DataModel, $TableName>
> = {
	[K in keyof $Select]:
		$Select[K] extends true ?
			// @ts-expect-error: works
			K extends keyof $DataModel[$TableName]['document'] ?
				// @ts-expect-error: works
				$DataModel[$TableName]['document'][K] :
			never :

		$Select[K] extends { select: infer $NestedSelect extends SelectInputFromDataModel<$DataModel, any> } ?
			// @ts-expect-error: works
			K extends keyof $DataModel[$TableName]['document'] ?
				// @ts-expect-error: works
				NonNullable<$DataModel[$TableName]['document'][K]> extends GenericId<infer $RefTableName>[] ?
					SelectOutputFromDataModel<$DataModel, $RefTableName, $NestedSelect>[] |
					// @ts-expect-error: works
					(null extends $DataModel[$TableName]['document'][K] ? null : never) :
				// @ts-expect-error: works
				NonNullable<$DataModel[$TableName]['document'][K]> extends GenericId<infer $RefTableName> ?
					SelectOutputFromDataModel<$DataModel, $RefTableName, $NestedSelect> |
					// @ts-expect-error: works
					(null extends NonNullable<$DataModel[$TableName]['document'][K]> ? null : never) :
				never :
			never :
		never
};
