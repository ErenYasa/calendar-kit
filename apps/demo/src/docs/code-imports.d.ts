// `import files from './Example.tsx?code'` (see code-plugin.ts): the file and
// the local files it imports, highlighted at build time.
declare module '*?code' {
  const files: readonly {
    name: string;
    lang: 'tsx' | 'ts' | 'css' | 'sh';
    code: string;
    /** Pre-highlighted, escaped HTML. */
    html: string;
  }[];
  export default files;
}
