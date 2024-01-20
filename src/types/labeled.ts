declare const label: unique symbol;

export type MultiLabelContainer<Token extends PropertyKey> = {
	readonly [label]?: { [K in Token]: void };
};

export type UnwrapLabeled<LabeledType extends MultiLabelContainer<PropertyKey>> =
	RemoveAllLabels<LabeledType>;

export type Labeled<Type, Tag extends PropertyKey> = Type &
	MultiLabelContainer<Tag>;

export type GetLabels<T> = T extends MultiLabelContainer<infer ExistingLabels>
	? ExistingLabels
	: never;

type RemoveAllLabels<T> = T extends MultiLabelContainer<infer ExistingLabels>
	? {
			[ThisTag in ExistingLabels]: T extends Labeled<infer Type, ThisTag>
				? RemoveAllLabels<Type>
				: never;
	  }[ExistingLabels]
	: T;

export type RemoveLabels<
	T,
	LabelsToRemove extends string
> = T extends MultiLabelContainer<infer ExistingLabels>
	? RemoveAllLabels<T> & MultiLabelContainer<
			Exclude<ExistingLabels, LabelsToRemove>
	  >
	: T;
