import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['./exports/main.ts'],
	outDir: '.build',
	declaration: true,
	rollup: {
		emitCJS: true,
		inlineDependencies: true,
	}
});
