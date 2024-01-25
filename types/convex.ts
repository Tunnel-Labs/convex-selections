import type { Validator } from 'convex/values';
import type { Simplify } from 'type-fest';

export interface SystemFields {
	_creationTime: number;
}

export type ExtractDocument<T extends Validator<any, any, any>> = Simplify<
	SystemFields & T['type']
>;

export type ExtractFieldPaths<T extends Validator<any, any, any>> =
	| T['fieldPaths']
	| keyof SystemFields;
