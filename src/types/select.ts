import type { GenericId } from 'convex/values';
import { Deprecated } from '~/types/deprecated.js';
import type { Virtual, VirtualArray } from '~/types/virtual.js';

// prettier-ignore
export type SelectInputFromDataModel<
	$DataModel,
	$TableName extends string,
	$WithCid extends boolean = false
> =
	($WithCid extends true ? { cid: true } : {}) &
	{
		[
			// @ts-expect-error: works
			K in keyof $DataModel[$TableName]['document'] as
				// @ts-expect-error: works
				$DataModel[$TableName]['document'][K] extends Deprecated ?
					never :
				K
			]?:
			// @ts-expect-error: works
			NonNullable<$DataModel[$TableName]['document'][K]> extends Array<infer $Item> ?
				NonNullable<$Item> extends GenericId<infer $SelectedTableName> ?
					$SelectedTableName extends $TableName ?
						true :
					{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName, $WithCid> } :
				NonNullable<$Item> extends VirtualArray<infer $SelectedTableName> ?
					{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName, $WithCid> } :
				NonNullable<$Item> extends Virtual<infer $SelectedTableName> ?
					{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName, $WithCid> } :
				true :

			// @ts-expect-error: works
			NonNullable<$DataModel[$TableName]['document'][K]> extends GenericId<infer $SelectedTableName> ?
				$SelectedTableName extends $TableName ?
					true :
				{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName, $WithCid> } :
			// @ts-expect-error: works
			NonNullable<$DataModel[$TableName]['document'][K]> extends VirtualArray<infer $SelectedTableName> ?
				{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName, $WithCid> } :
			// @ts-expect-error: works
			NonNullable<$DataModel[$TableName]['document'][K]> extends Virtual<infer $SelectedTableName> ?
				{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName, $WithCid> } :

			true
	};

// prettier-ignore
export type SelectOutputFromDataModel<
	$DataModel,
	$TableName extends string,
	$Select extends Omit<SelectInputFromDataModel<$DataModel, $TableName>, 'id'>
> = { __tableName?: $TableName } & {
	[K in keyof $Select]:
		$Select[K] extends true ?
			// @ts-expect-error: works
			K extends keyof $DataModel[$TableName]['document'] ?
				// @ts-expect-error: works
				$DataModel[$TableName]['document'][K] :
			never :

		$Select[K] extends { select: infer $NestedSelect } ?
			// @ts-expect-error: works
			K extends keyof $DataModel[$TableName]['document'] ?
				// @ts-expect-error: works
				NonNullable<$DataModel[$TableName]['document'][K]> extends GenericId<infer $RefTableName>[] ?
					SelectOutputFromDataModel<
						$DataModel,
						$RefTableName,
						// @ts-expect-error: works
						$NestedSelect
					>[] |
					// @ts-expect-error: works
					(null extends $DataModel[$TableName]['document'][K] ? null : never) :
				// @ts-expect-error: works
				NonNullable<$DataModel[$TableName]['document'][K]> extends VirtualArray<infer $RefTableName> ?
					SelectOutputFromDataModel<
						$DataModel,
						$RefTableName,
						// @ts-expect-error: works
						$NestedSelect
					>[] :
				// @ts-expect-error: works
				NonNullable<$DataModel[$TableName]['document'][K]> extends GenericId<infer $RefTableName> ?
					SelectOutputFromDataModel<
						$DataModel,
						$RefTableName,
						// @ts-expect-error: works
						$NestedSelect
					> |
					// @ts-expect-error: works
					(null extends $DataModel[$TableName]['document'][K] ? null : never) :
				// @ts-expect-error: works
				NonNullable<$DataModel[$TableName]['document'][K]> extends Virtual<infer $RefTableName> ?
					SelectOutputFromDataModel<
						$DataModel,
						$RefTableName,
						// @ts-expect-error: works
						$NestedSelect
					> |
					// @ts-expect-error: works
					(null extends $DataModel[$TableName]['document'][K] ? null : never) :
				never :
			never :
		never
};
