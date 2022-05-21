module.exports = {
  presets: [
    ['@babel/preset-env', { bugfixes: true }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-export-default-from',
    [
      '@babel/plugin-transform-typescript',
      {
        // force typescript to support jsx in all files no matter the extension I guess
        isTSX: true,
        allExtensions: true,
        allowDeclareFields: true,
        onlyRemoveTypeImports: true,
      },
    ],
  ],
}
