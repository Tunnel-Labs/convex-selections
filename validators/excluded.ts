import type { Labeled } from '#types';
import type { Validator } from 'convex/values';

export function vExcluded<
	$Validator extends Validator<any, any, any>,
>(
	validator: $Validator,
): $Validator extends
	Validator<infer $TypeScriptType, infer $Optional, infer $FieldPaths> ?
	Validator<
		| Labeled<$TypeScriptType, '__excluded__'>
		| (null extends $TypeScriptType ? null : never),
		$Optional,
		$FieldPaths
	> :
	never
{
	// @ts-expect-error: internal property
	validator.json.__excluded = true;
	return validator as any;
}
