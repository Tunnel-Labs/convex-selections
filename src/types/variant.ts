// prettier-ignore
export type PickCurrent<$Document> =
	// Include all non-new and non-deprecated fields
	{
		[
			$Key in keyof $Document as
				'__new__' extends keyof NonNullable<$Document[$Key]> ?
					never :
				'__deprecated__' extends keyof NonNullable<$Document[$Key]> ?
					never :
				$Key
		]: $Document[$Key]
	} &
	// Set deprecated fields to undefined
	{
		[
			$Key in keyof $Document as
				'__deprecated__' extends keyof NonNullable<$Document[$Key]> ?
					$Key :
				never
		]?: undefined
	} &
	// Make new fields required
	{
		[
			$Key in keyof $Document as
				'__new__' extends keyof NonNullable<$Document[$Key]> ?
					$Key :
				never
		]-?: Exclude<$Document[$Key], undefined>
	};

// prettier-ignore
export type PickDeprecated<$Document> =
	// Include all non-new and non-deprecated fields
	{
		[
			$Key in keyof $Document as
				'__new__' extends keyof NonNullable<$Document[$Key]> ?
					never :
				'__deprecated__' extends keyof NonNullable<$Document[$Key]> ?
					never :
				$Key
		]: $Document[$Key]
	} &
	// Set new fields to undefined
	{
		[
			$Key in keyof $Document as
				// Exclude deprecated fields so they can be made required
				'__new__' extends keyof NonNullable<$Document[$Key]> ?
					$Key :
				never
		]?: undefined
	} &
	// Make deprecated fields required
	{
		[
			$Key in keyof $Document as
				'__deprecated__' extends keyof NonNullable<$Document[$Key]> ?
					$Key :
				never
		]-?: Exclude<$Document[$Key], undefined>
	};
