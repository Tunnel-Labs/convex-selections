declare const tag: unique symbol;

type MultiTagContainer<Token extends PropertyKey> = {
	readonly [tag]?: { [K in Token]: void };
};

export type UnwrapTagged<TaggedType extends MultiTagContainer<PropertyKey>> =
	RemoveAllTags<TaggedType>;

export type Tagged<Type, Tag extends PropertyKey> = Type &
	MultiTagContainer<Tag>;

export type GetTags<T> = T extends MultiTagContainer<infer ExistingTags>
	? ExistingTags
	: never;

type RemoveAllTags<T> = T extends MultiTagContainer<infer ExistingTags>
	? {
			[ThisTag in ExistingTags]: T extends Tagged<infer Type, ThisTag>
				? RemoveAllTags<Type>
				: never;
	  }[ExistingTags]
	: T;
