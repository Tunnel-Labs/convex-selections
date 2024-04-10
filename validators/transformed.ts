import { Labeled } from '#types';
import { v } from 'convex/values';
import type { Infer, Validator } from 'convex/values';

export function vTransformed<$Validator extends Validator<any, any, any>>(
	validator: $Validator,
): {
	from<$DeprecatedValidator extends Validator<any, any, any>>(
		deprecatedValidator: $DeprecatedValidator,
	): Validator<
		| (
			& Labeled<NonNullable<Infer<$Validator>>, '__transformed__'>
			& { __deprecatedType__?: Infer<$DeprecatedValidator> }
		)
		| (null extends Infer<$Validator> ? null : never),
		$Validator['isOptional'],
		$Validator['fieldPaths']
	>;
} {
	return {
		from(deprecatedValidator) {
			// @ts-expect-error: setting a custom property
			validator.json.__deprecatedValidator = deprecatedValidator;
			return v.union(validator, deprecatedValidator);
		},
	};
}
