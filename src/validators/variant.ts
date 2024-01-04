import { v, type Validator } from 'convex/values';
import { Tagged } from '~/types/tagged.js';

/**
	Deprecated fields are read-only fields. Since we stop writing to them, they can be optional.
*/
export function vDeprecated<$Type>(
	_message: string
): Validator<Tagged<$Type, '__deprecated__'>, true, string> {
	return v.optional(v.any()) as any;
}

/**
	A newly added property, meaning that it can be optional.
*/
export function vNew<$Validator extends Validator<any, any, any>>(
	validator: $Validator
): $Validator extends Validator<infer $TypeScriptType, any, infer $FieldPaths>
	? Validator<
			| Tagged<$TypeScriptType, '__new__'>
			| undefined
			| (null extends $TypeScriptType ? null : never),
			true,
			$FieldPaths
	  >
	: never {
	return v.optional(validator) as any;
}
