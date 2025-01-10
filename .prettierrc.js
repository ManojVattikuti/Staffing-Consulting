module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  proseWrap: 'preserve', // for markdown
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',
  // https://prettier.io/docs/en/configuration.html#configuration-overrides
  overrides: [
    {
      files: ['*.yml'],
      options: {
        parser: 'yaml',
        singleQuote: true,
      },
    },
    {
      files: ['*.{html,template.html,component.html}'],
      options: {
        parser: 'angular',
      },
    },
  ],
};
// NOTE: _Never_ put the `parser` option at the top level of your configuration. _Only_ use it inside `overrides`. Otherwise you effectively disable Prettier's automatic file extension based parser inference. This forces Prettier to use the parser you specified for _all_ types of files – even when it doesn't make sense, such as trying to parse a CSS file as JavaScript. (from https://prettier.io/docs/en/configuration.html#setting-the-parser-docs-en-optionshtml-parser-option)
