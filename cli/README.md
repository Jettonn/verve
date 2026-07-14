# @jettonn/verve

Add [Verve](https://verve.jettonn.dev) micro-interaction motion components straight into your Vue app —
source and all. No runtime package, no lock-in.

```bash
# add one (or several) components
npx @jettonn/verve@latest add forward-button
npx @jettonn/verve@latest add forward-button volume-button

# add everything
npx @jettonn/verve@latest add --all

# see what's available
npx @jettonn/verve@latest list
```

Each `add` writes the component into `src/components/ui/`, drops the shared `useReducedMotion`
composable into `src/lib/`, and installs its npm deps (`motion-v`, and `lucide-vue-next` for the
components that use icons) with whatever package manager your project uses.

The components import `@/lib/useReducedMotion`, so your project needs the conventional `@ → src`
alias (the default in every Vue/Vite scaffold). If your layout differs, point the CLI at the right
folders:

```bash
npx @jettonn/verve@latest add tooltip --ui src/ui --lib src/utils
```

## Options

| Flag | Description |
| --- | --- |
| `--all` | Add every component |
| `--overwrite` | Overwrite files that already exist |
| `--no-install` | Skip installing npm dependencies |
| `--ui <dir>` | Component target dir (default `src/components/ui`) |
| `--lib <dir>` | Composable target dir (default `src/lib`) |
| `--cwd <dir>` | Project root (default `.`) |
| `--registry <url>` | Registry base URL (default `https://verve.jettonn.dev/r`) |

## How it works

`verve` is a thin client over the Verve registry — the same static JSON the site serves at
`/r/<name>.json`. It resolves each component's `registryDependencies`, writes the inlined source, and
hands the npm deps to your package manager. Nothing is bundled at runtime; you own the files.

## License

MIT © Jeton Korenica
