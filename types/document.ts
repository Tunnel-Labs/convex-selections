import type { Validator } from 'convex/values';

export type AnyDocumentSchema = Validator<Record<string, any>, false, any>;
