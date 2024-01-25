import { Labeled } from '#types/_.ts';
import { v } from 'convex/values';
import type { Infer, Validator } from 'convex/values';
import type { RequireAtLeastOne } from 'type-fest';

export function vTransformed<$Validator extends Validator<any, any, any>>(
	validator: $Validator,
): {
	from<$DeprecatedType>(
		discriminatorValidator: Validator<
			RequireAtLeastOne<
				Omit<$DeprecatedType, keyof NonNullable<Infer<$Validator>>>
			>,
			any,
			any
		>,
	): Validator<
		| (
			& Labeled<NonNullable<Infer<$Validator>>, '__transformed__'>
			& { __deprecatedType__?: $DeprecatedType }
		)
		| (null extends Infer<$Validator> ? null : never),
		$Validator['isOptional'],
		$Validator['fieldPaths']
	>;
} {
	return {
		from(discriminatorValidator) {
			// @ts-expect-error: setting a custom property
			validator.json.__discriminatorValidator = discriminatorValidator;
			return v.union(validator, discriminatorValidator);
		},
	};
}
