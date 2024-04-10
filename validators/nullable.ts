import { v, type Validator } from 'convex/values';

export function vNullable<$Validator extends Validator<any, any, any>>(
	validator: $Validator,
) {
	return v.union(validator, v.null());
}
