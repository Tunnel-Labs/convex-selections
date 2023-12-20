import { v, type Validator } from 'convex/values';

/**
	Deprecated fields are read-only fields. Since we stop writing to them, they can be optional.
*/
export function vDeprecated<$Type>(
	_message: string
): Validator<$Type & { __deprecated__?: true }, true, string> {
	return v.optional(v.any()) as any;
}

// prettier-ignore
export function vDeprecatedTable(): Validator<any, false, string> {
	return v.any() as any;
}

/**
	A newly added property, meaning that it can be optional.
*/
export function vNew<$Validator extends Validator<any, any, any>>(
	validator: $Validator
): $Validator extends Validator<infer $TypeScriptType, any, infer $FieldPaths>
	? Validator<
			| ($TypeScriptType & { __new__?: true })
			| undefined
			| (null extends $TypeScriptType ? null : never),
			true,
			$FieldPaths
	  >
	: never {
	return v.optional(validator) as any;
}
