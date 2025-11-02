# PHPX Starter Kit

**React-like components in PHP, running in your browser via WebAssembly.**

Build interactive web applications using familiar JSX syntax, component-based architecture, and React hooks—all in PHP!

## Quick Start

Create a new PHPX project in seconds:

```bash
composer create-project syntaxx/phpx-starter-kit my-app
cd my-app
composer wasm
composer serve
```

Open `http://localhost:9999` and start building! 🚀

## Your First Component

Create interactive components with JSX syntax and React hooks:

```php
<?php

namespace Syntaxx\PHPX\Demo;

use Syntaxx\PHPX\Framework\Component;
use Syntaxx\PHPX\Framework\Runtime;
use Syntaxx\PHPX\Framework\Document;
use function Syntaxx\PHPX\Framework\useState;

function MyApp() {
    return (
        <div>
            <h1>Click to increment</h1>
            <MyButton />
        </div>
    );
}

function MyButton() {
    [$count, $setCount] = useState(0);

    $handleClick = function() use ($count, $setCount) {
        $setCount($count + 1);
    };

    return (
        <button onClick={$handleClick}>
            Count: {$count}
        </button>
    );
}

// Render to DOM
$root = Runtime::createRoot(Document::document()->getElementById('root'));
$root->render(
    Component::create("StrictMode", [], [
        Component::create("MyApp", [], [])
    ])
);
```

**That's it!** You now have a fully interactive counter running PHP in your browser.

## What You Get

✅ **JSX Syntax** - Write `<div>` just like React
✅ **React Hooks** - `useState`, state management
✅ **Component Architecture** - Composable, reusable components
✅ **Event Handling** - `onClick`, `onChange`, and more
✅ **Zero JavaScript** - Everything is PHP (compiled to WebAssembly)
✅ **Fast Builds** - Vendor caching, watch mode, live reload ready

## Development Workflow

```bash
# Terminal 1: Auto-rebuild on changes
composer wasm:watch

# Terminal 2: Development server
composer serve
```

Edit your `.phpx` files in `src/`, save, and refresh your browser. Changes appear instantly!

## Project Structure

```
my-app/
├── src/               # Your PHPX components (.phpx files)
│   └── App.phpx       # Main application component
├── public/            # Web root
│   ├── index.html     # HTML entry point
│   ├── css/           # Stylesheets
│   └── build/         # Compiled WebAssembly files (auto-generated)
├── bootstrap.php      # Application entry point
└── composer.json      # Dependencies and build scripts
```

## Available Commands

| Command | Description |
|---------|-------------|
| `composer wasm` | Build for production |
| `composer wasm:watch` | Auto-rebuild on file changes |
| `composer serve` | Start development server (auto-detects port from 9999) |
| `composer wasm:dev` | Development build with source maps |

## How It Works

1. **Write Components** - Create `.phpx` files with JSX syntax
2. **Compile** - PHPX compiler transforms JSX → PHP
3. **Pack** - WebAssembly packer bundles your app
4. **Run** - PHP WebAssembly runtime executes in browser
5. **Interact** - VRZNO bridge connects PHP ↔ JavaScript/DOM

**Result:** Your PHP code runs entirely in the browser, no server required!

## Learn More

- **Full Documentation**: [docs.phpx.dev](https://docs.phpx.dev) _(coming soon)_
- **Examples**: Check the `src/` directory for more component examples
- **Framework Docs**: See `vendor/syntaxx/phpx-framework/README.md`
- **Build System**: See `vendor/syntaxx/phpx-build-tools/README.md`

## Requirements

- **PHP 8.4+** (for local development/builds)
- **Composer** (dependency management)
- **Modern Browser** with WebAssembly support (Chrome, Firefox, Safari, Edge)

## Features

🎯 **React-like Experience**
- JSX syntax: `<button onClick={$handler}>Click me</button>`
- Hooks: `useState()`, state management
- Component composition and props
- Declarative UI updates

⚡ **Fast Development**
- Vendor caching (10-15s → 0.4s rebuilds)
- Watch mode with auto-rebuild
- Port auto-detection (no conflicts!)
- Source maps for debugging

## Troubleshooting

**Build errors?**
```bash
rm -rf build/ vendor/
composer install
composer wasm
```

**Port already in use?**
The `serve` command auto-detects available ports (9999 → 9998 → 9997...).

**Browser not loading?**
Check browser console (F12) for errors. Ensure WebAssembly is supported.

## Contributing

Found a bug? Have a feature idea? We'd love your contribution!

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Acknowledgments

Built with:
- [PHPX Framework](https://github.com/syntaxx/phpx-framework) - React-like components for PHP
- [PHPX Compiler](https://github.com/syntaxx/phpx-compiler) - JSX to PHP transformer
- [PHPX BuildTools](https://github.com/syntaxx/phpx-build-tools) - Build system
- [PHP WebAssembly Runtime](https://github.com/syntaxx/phpx-wasm-runtime-vrzno) - PHP in the browser
