// dprint-ignore-file
//
import type { GetLabels, RemoveLabels } from '#types/$.ts';

export type IsNew<$Value> =
	'__new__' extends GetLabels<NonNullable<$Value>> ?
		true :
	false;

export type IsDeprecated<$Value> =
	'__deprecated__' extends GetLabels<NonNullable<$Value>> ?
		true :
	false;

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
		]-?: RemoveLabels<Exclude<$Document[$Key], undefined>, '__new__'>
	};

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
		]-?: RemoveLabels<Exclude<$Document[$Key], undefined>, '__deprecated__'>
	};

export type CurrentDocument<$Document> = PickCurrent<$Document>;

/**
	A `DeprecatedDoc` is a wrapper around a convex `Doc` that includes all deprecated fields and omits all new fields required.
*/
export type DeprecatedDocument<$Document> = PickDeprecated<$Document>;
