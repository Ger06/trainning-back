const config = {
  '**/*.{ts?(x),mts}': () => 'tsc -p tsconfig.build.json --noEmit',
  '*.{js,jsx,mjs,cjs,ts,tsx,mts}': 'npm run lint',
  '*.{md,json}': 'prettier --write',
};

export default config;
