import type { GetLabels, UnwrapLabeled } from '../types/Labeled.js';

export type IsNew<$Value> = '__new__' extends GetLabels<NonNullable<$Value>>
	? true
	: false;

export type IsDeprecated<$Value> = '__deprecated__' extends GetLabels<
	NonNullable<$Value>
>
	? true
	: false;

// prettier-ignore
export type PickCurrent<$Document> =
	// Include all non-new and non-deprecated fields
	{
		[
			$Key in keyof $Document as
				IsNew<NonNullable<$Document[$Key]>> extends true ?
					never :
				IsDeprecated<NonNullable<$Document[$Key]>> extends true ?
					never :
				$Key
		]: $Document[$Key]
	} &
	// Set deprecated fields to undefined
	{
		[
			$Key in keyof $Document as
				IsDeprecated<NonNullable<$Document[$Key]>> extends true ?
					$Key :
				never
		]?: undefined
	} &
	// Make new fields required
	{
		[
			$Key in keyof $Document as
			 	IsNew<NonNullable<$Document[$Key]>> extends true ?
					$Key :
				never
				// @ts-expect-error: will be Labeled
		]-?: UnwrapLabeled<Exclude<$Document[$Key], undefined>>
	};

// prettier-ignore
export type PickDeprecated<$Document> =
	// Include all non-new and non-deprecated fields
	{
		[
			$Key in keyof $Document as
				IsNew<NonNullable<$Document[$Key]>> extends true ?
					never :
				IsDeprecated<NonNullable<$Document[$Key]>> extends true ?
					never :
				$Key
		]: $Document[$Key]
	} &
	// Set new fields to undefined
	{
		[
			$Key in keyof $Document as
				IsNew<NonNullable<$Document[$Key]>> extends true ?
					$Key :
				never
		]?: undefined
	} &
	// Make deprecated fields required
	{
		[
			$Key in keyof $Document as
				IsDeprecated<NonNullable<$Document[$Key]>> extends true ?
					$Key :
				never
				// @ts-expect-error: will be Labeled
		]-?: UnwrapLabeled<Exclude<$Document[$Key], undefined>>
	};
