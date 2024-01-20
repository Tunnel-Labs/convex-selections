import { AnyDataModel } from 'convex/server';
import type { GenericId } from 'convex/values';
import type { UnwrapLabeled } from '../types/labeled.js';
import type { PickCurrent, PickDeprecated } from '../types/variant.js';
import type { IsVirtual, IsVirtualArray } from '../types/virtual.js';

// prettier-ignore
export type SelectInputFromDataModel<
	$DataModel extends AnyDataModel,
	$TableName extends string,
	$WithCid extends boolean = false
> =
	($WithCid extends true ? { cid: true } : {}) &
	{
		[K in keyof $DataModel[$TableName]['document']]?:
			NonNullable<$DataModel[$TableName]['document'][K]> extends Array<infer $Item> ?
				NonNullable<$Item> extends GenericId<infer $SelectedTableName> ?
					$SelectedTableName extends $TableName ?
						true :
					{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName, $WithCid> } :
				IsVirtualArray<NonNullable<$Item>> extends true ?
					{
						select: SelectInputFromDataModel<
							$DataModel,
							// @ts-expect-error: works
							UnwrapLabeled<NonNullable<$Item>>,
							$WithCid
						>
					} :
				IsVirtual<NonNullable<$Item>> extends true ?
					{
						select: SelectInputFromDataModel<
							$DataModel,
							// @ts-expect-error: works
							UnwrapLabeled<NonNullable<$Item>>,
							$WithCid
						>
					} :
				true :

			NonNullable<$DataModel[$TableName]['document'][K]> extends GenericId<infer $SelectedTableName> ?
				$SelectedTableName extends $TableName ?
					true :
				{ select: SelectInputFromDataModel<$DataModel, $SelectedTableName, $WithCid> } :
			IsVirtualArray<NonNullable<$DataModel[$TableName]['document'][K]>> extends true ?
				{
					select: SelectInputFromDataModel<
						$DataModel,
						UnwrapLabeled<NonNullable<$DataModel[$TableName]['document'][K]>>,
						$WithCid
					> } :
			IsVirtual<NonNullable<$DataModel[$TableName]['document'][K]>> extends true ?
				{
					select: SelectInputFromDataModel<
						$DataModel,
						UnwrapLabeled<NonNullable<$DataModel[$TableName]['document'][K]>>,
						$WithCid
					>
				} :

			true
	};

// prettier-ignore
export type SelectOutputValue<
	$DataModel extends AnyDataModel,
	$TableName extends string,
	$Select extends Omit<SelectInputFromDataModel<$DataModel, $TableName>, 'id'>
> = {
	[K in keyof $Select]:
		$Select[K] extends true ?
			K extends keyof $DataModel[$TableName]['document'] ?
				$DataModel[$TableName]['document'][K] :
			never :

		$Select[K] extends { select: infer $NestedSelect } ?
			K extends keyof $DataModel[$TableName]['document'] ?
				NonNullable<$DataModel[$TableName]['document'][K]> extends GenericId<infer $RefTableName>[] ?
					SelectOutputFromDataModel<
						$DataModel,
						$RefTableName,
						// @ts-expect-error: works
						$NestedSelect
					>[] |
					(null extends $DataModel[$TableName]['document'][K] ? null : never) :
				IsVirtualArray<NonNullable<$DataModel[$TableName]['document'][K]>> extends true ?
					SelectOutputFromDataModel<
						$DataModel,
						UnwrapLabeled<NonNullable<$DataModel[$TableName]['document'][K]>>,
						// @ts-expect-error: works
						$NestedSelect
					>[] :
				NonNullable<$DataModel[$TableName]['document'][K]> extends GenericId<infer $RefTableName> ?
					SelectOutputFromDataModel<
						$DataModel,
						$RefTableName,
						// @ts-expect-error: works
						$NestedSelect
					> |
					(null extends $DataModel[$TableName]['document'][K] ? null : never) :
				IsVirtual<NonNullable<$DataModel[$TableName]['document'][K]>> extends true ?
					SelectOutputFromDataModel<
						$DataModel,
						UnwrapLabeled<NonNullable<$DataModel[$TableName]['document'][K]>>,
						// @ts-expect-error: works
						$NestedSelect
					> |
					(null extends $DataModel[$TableName]['document'][K] ? null : never) :
				never :
			never :
		never
}

// prettier-ignore
export type SelectOutputFromDataModel<
	$DataModel extends AnyDataModel,
	$TableName extends string,
	$Select extends Omit<SelectInputFromDataModel<$DataModel, $TableName>, 'id'>
> =
	{ __tableName?: $TableName } &
	(
		PickCurrent<SelectOutputValue<$DataModel, $TableName, $Select>> |
		PickDeprecated<SelectOutputValue<$DataModel, $TableName, $Select>>
	)
