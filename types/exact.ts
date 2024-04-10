// dprint-ignore-file

import type { MultiLabelContainer } from '#types';

export type IsNever<T> = [T] extends [never] ? true : false;

// prettier-ignore
export type ArrayElement<T> = T extends readonly unknown[] ? T[0] : never;

// prettier-ignore
export type ObjectValue<T, K> = K extends keyof T ? T[K] : never;

// prettier-ignore
export type IsEqual<A, B> =
	(<G>() => G extends A ? 1 : 2) extends
	(<G>() => G extends B ? 1 : 2)
		? true
		: false;

// prettier-ignore
export type KeysOfUnion<ObjectType> = ObjectType extends unknown
	? keyof ObjectType
	: never;

// prettier-ignore
type ExactObject<ParameterType, InputType> = {
	[Key in keyof ParameterType]:
		IsNever<ObjectValue<InputType, Key>> extends true ?
			ParameterType[Key] :
		Exact<ParameterType[Key], ObjectValue<InputType, Key>>
}
& Record<Exclude<keyof InputType, KeysOfUnion<ParameterType>>, never>;

// prettier-ignore
export type Exact<ParameterType, InputType> =
	IsEqual<ParameterType, InputType> extends true ? ParameterType
		// Convert union of array to array of union: A[] & B[] => (A & B)[]
		: ParameterType extends unknown[] ? Array<Exact<ArrayElement<ParameterType>, ArrayElement<InputType>>>
			// In TypeScript, Array is a subtype of ReadonlyArray, so always test Array before ReadonlyArray.
			: ParameterType extends readonly unknown[] ? ReadonlyArray<Exact<ArrayElement<ParameterType>, ArrayElement<InputType>>>
				// Leave Labeled types as-is. We could try to make the unLabeled part Exact, and just leave the tag as-is, but that seems to create instantiation excessively deep errors.
				: ParameterType extends MultiLabelContainer<any> ? ParameterType
					: ParameterType extends object ? ExactObject<ParameterType, InputType>
						: ParameterType;
