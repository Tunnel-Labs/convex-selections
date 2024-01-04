import { AnyDataModel } from 'convex/server';
import type { ProcedureReturnType } from '../types/procedure.js';
import type { SelectOutputFromDataModel } from '../types/select.js';

export type TableNameFromProcedureCallback<
	$DataModel extends AnyDataModel,
	$ProcedureCallback extends (selection: any) => any
> = Exclude<
	ProcedureReturnType<$ProcedureCallback>,
	null
> extends SelectOutputFromDataModel<$DataModel, any, any>[]
	? NonNullable<
			Exclude<
				ProcedureReturnType<$ProcedureCallback>,
				null
			>[number]['__tableName']
	  >
	: Exclude<
			ProcedureReturnType<$ProcedureCallback>,
			null
	  > extends SelectOutputFromDataModel<$DataModel, any, any>
	? NonNullable<
			Exclude<ProcedureReturnType<$ProcedureCallback>, null>['__tableName']
	  >
	: never;
