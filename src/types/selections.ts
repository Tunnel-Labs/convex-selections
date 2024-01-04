import { AnyDataModel } from 'convex/server';
import type { UnionToIntersection } from 'type-fest';
import type { SelectInputFromDataModel } from '../types/select.js';

// prettier-ignore
export type ExpandMapping<$SelectionMappings, $Options> = {
	[$OptionKey in keyof $Options]:
		$OptionKey extends keyof $SelectionMappings ?
			ExpandMapping<$SelectionMappings, $SelectionMappings[$OptionKey]> :
		Record<$OptionKey, $Options[$OptionKey]>;
}[keyof $Options];

export type WithOptions<
	$DataModel extends AnyDataModel,
	$Selections extends Record<string, unknown>,
	$TableName extends string
> = SelectInputFromDataModel<$DataModel, $TableName> & {
	[Key in keyof $Selections]?: boolean;
};

export type SelectionSelect<
	$Selections extends Record<string, unknown>,
	$Options
> = UnionToIntersection<ExpandMapping<$Selections, $Options>>;

// prettier-ignore
export type Selections<$SelectionMappingObject> = keyof {
	[
		$K in keyof $SelectionMappingObject as $K extends `$${string}` ?
			$K :
		never
	]: true
};

// prettier-ignore
export type RecursivelyExpandSelection<
	$SelectionMapping,
	$SelectionMappingObject
> =
	Omit<$SelectionMappingObject, `$${string}`> &
	(Selections<$SelectionMappingObject> extends never ?
		// eslint-disable-next-line @typescript-eslint/ban-types -- We need to intersect with the empty object type
		{} :
	{
		[K in Selections<$SelectionMappingObject>]:
			K extends keyof $SelectionMapping ?
				$SelectionMapping[K] :
			never;
	}[Selections<$SelectionMappingObject>]);

export type ExpandSelections<
	$SelectionMappings extends Record<string, Record<string, unknown>>
> = {
	[$Key in keyof $SelectionMappings]: RecursivelyExpandSelection<
		$SelectionMappings,
		$SelectionMappings[$Key]
	>;
};
