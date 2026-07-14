<div align="center">
  <h1>Verve</h1>
  <p>A curated library of Vue micro-interactions and motion components powered by motion-v.</p>

  <p>
    <a href="https://github.com/Jettonn/verve/stargazers">
      <img src="https://img.shields.io/github/stars/Jettonn/verve?style=flat&color=F5A623" alt="GitHub Stars" />
    </a>
    <a href="https://github.com/Jettonn/verve/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/Jettonn/verve?style=flat&color=50E3C2" alt="License" />
    </a>
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs Welcome" />
  </p>
</div>

## ✨ Features

- ⚡️ **Copy-in components**: Each interaction is one self-contained `.vue` file — no runtime package, no lock-in.
- 🧩 **One-command install**: `npx @jettonn/verve add <name>` writes the source into your app and installs its deps.
- 🎛️ **Tunable motion**: Sensible defaults you can fine-tune per component.
- 🌓 **Dark & Light**: Components and the live gallery adapt to the active theme.
- 📋 **One-click Copy**: Every component previews its source with copy-to-clipboard in the sandbox.
- 🔌 **shadcn-vue compatible**: Served as a static registry, so `npx shadcn-vue add <url>` works too.

## 🛠️ Tech Stack

- **Framework**: Vue 3 (with TypeScript)
- **Styling**: Tailwind CSS v4
- **Animations**: [motion-v](https://motion.dev/docs/vue)
- **Icons**: Lucide (`lucide-vue-next`)
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites
- Node.js (v22+)
- pnpm (or npm)

### 1. Clone the Repository
```bash
git clone https://github.com/Jettonn/verve.git
cd verve
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Start Development Server
```bash
pnpm dev
```

### 4. Build for Production
```bash
pnpm build
```

## 📦 Add Components to Your App

Pull any component's source straight into your Vue app with the CLI — it writes the file into `src/components/ui/`, drops in the shared composable, and installs its deps:

```bash
npx @jettonn/verve@latest add forward-button   # one component
npx @jettonn/verve@latest add --all            # everything
npx @jettonn/verve@latest list                 # see what's available
```

Works with any package manager (`pnpm dlx @jettonn/verve@latest …`, `yarn dlx`, `bunx` too). It's a plain [shadcn-vue](https://shadcn-vue.com)–compatible registry served at `https://verve.jettonn.dev/r/<name>.json`, so `npx shadcn-vue@latest add <url>` resolves it as well.

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
