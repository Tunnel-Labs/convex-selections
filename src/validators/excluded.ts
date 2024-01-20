import type { Validator } from "convex/values";
import type { Tagged } from "type-fest";

export function vExcluded<
	$Validator extends Validator<any, any, any>,
>(
	validator: $Validator,
): $Validator extends Validator<infer $TypeScriptType, any, infer $FieldPaths> ?
	Validator<
		| Tagged<$TypeScriptType, '__excluded__'>
		| undefined
		| (null extends $TypeScriptType ? null : never),
		true,
		$FieldPaths
	> :
	never
{
	// @ts-expect-error: internal property
	validator.json.__excluded = true;
	return validator as any;
}
