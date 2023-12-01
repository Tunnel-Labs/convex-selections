import type { Validator } from 'convex/values';
import { v } from 'convex/values';

export function vDeprecated<$Message extends string>(
	_message: $Message
): Validator<`Deprecated: ${$Message}`, true, string> {
	return v.optional(v.any());
}

export function vDeprecatedTable<$Message extends string>(
	_message: $Message
): Validator<`Deprecated: ${$Message}`, false, string> {
	return v.any();
}
