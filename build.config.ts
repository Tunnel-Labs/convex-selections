import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['_.ts'],
	outDir: '.build',
	declaration: true,
	rollup: {
		emitCJS: true,
		inlineDependencies: true,
	}
});
