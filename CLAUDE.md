# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Module Overview

PHPX-wasmstarter-phpx is an intermediate starter template that demonstrates the PHPX Framework with React-like components running in WebAssembly. It bridges the gap between basic DOM manipulation and full framework development, introducing developers to component-based PHP development in the browser using familiar React patterns like hooks and JSX syntax.

## Project Architecture

### Core Concepts
- Component-based architecture using PHPX Framework
- React-like syntax with JSX in PHP
- State management with hooks (useState)
- Declarative UI updates via virtual DOM
- Server-side and client-side rendering capabilities

### Directory Structure
```
├── build/             # Compiled components and WASM artifacts
├── public/            # Web-accessible files
│   ├── build/         # WebAssembly runtime files
│   ├── css/
│   │   └── style.css  # Application styles
│   └── index.html     # Entry HTML file
├── src/
│   └──App.phpx        # Main component (JSX syntax)
├── bootstrap.php      # Application initialization
└── composer.json
```

## Build System

### Modern Build System (PHPX-BuildTools)

The project uses **PHPX-BuildTools**, a unified CLI providing fast builds with vendor caching and watch mode.

#### Key Features
- ✅ **Vendor Caching**: 5-10x faster rebuilds (caches based on composer.json/lock hash)
- ✅ **Watch Mode**: Auto-rebuild on file changes
- ✅ **Dev/Prod Modes**: Separate builds with `--dev` flag
- ✅ **Integrated Compilation**: PHPX compilation included automatically
- ✅ **Temp Directory**: Builds in `/tmp/phpx-build/` (no local clutter)

#### Build Commands

```bash
# Production build (default)
composer wasm                  # Full build: compile + pack + export

# Development build (with source maps)
composer wasm:dev             # Build with --dev --create-html-maps flags

# Watch mode (auto-rebuild on file changes)
composer wasm:watch           # Production watch
composer wasm:watch:dev       # Development watch

# Individual steps
composer wasm:pack            # Pack only
composer wasm:export          # Export only

# Legacy (deprecated, will be removed)
composer wasm:legacy          # Old PHP script-based build
```

### Complete Development Flow

#### First Time Setup
```bash
# Install dependencies
composer install

# Initial build
composer wasm:dev
```

#### Development Workflow
```bash
# Terminal 1: Watch for changes and auto-rebuild
composer wasm:watch:dev

# Terminal 2: Development server
composer serve

# Visit: http://localhost:9909
```

### Build Process Flow

1. **Create Temp Directory**: `/tmp/phpx-build/{project}-{hash}`
2. **Copy Files**: `bootstrap.php`, `src/`
3. **Vendor Caching**:
   - Hash composer.json + composer.lock
   - Check cache: `/tmp/phpx-build/{project}-vendor-{hash}`
   - Cache hit → Copy (0.4s)
   - Cache miss → `composer install --no-dev` → Cache (10-20s)
4. **Compile PHPX**: `vendor/syntaxx/phpx-compiler/bin/compile --compile-php-files`
5. **Pack WebAssembly**: Creates `build/php-web.data` using file-packager
6. **Export**: Copy to `public/build/`
7. **Cleanup**: Remove temp directory
8. **Report**: Display final size

### Performance

| Operation | First Build | Cached Build |
|-----------|-------------|--------------|
| Full build | ~15-20s | ~3-5s |
| Watch rebuild | N/A | ~2-3s |

**Vendor caching** eliminates 10-15s of `composer install` time on every rebuild!

## PHPX Framework Integration

### Component Structure

#### Main App Component (`src/App.phpx`)
```php
<?php
use Kambo\PHPX\Framework\Component;

function App() {
    return (
        <div className="app-container">
            <div className="header">
                <h1>PHPX Framework Demo</h1>
                <p>React-like components in PHP</p>
            </div>
            <div className="content">
                <MyButton />
            </div>
        </div>
    );
}
```

#### Stateful Component (`src/MyButton.phpx`)
```php
<?php
use function Kambo\PHPX\Framework\useState;
use Kambo\PHPX\Framework\Component;

function MyButton() {
    [$count, $setCount] = useState(0);
    
    return (
        <div className="counter-widget">
            <h2>Interactive Counter</h2>
            <p>Current count: <span className="count">{$count}</span></p>
            <button 
                className="btn btn-primary"
                onClick={fn() => $setCount($count + 1)}
            >
                Increment
            </button>
            <button 
                className="btn btn-secondary"
                onClick={fn() => $setCount(0)}
            >
                Reset
            </button>
        </div>
    );
}
```

### JSX Syntax Features

#### Supported JSX Elements
```php
// HTML elements
<div className="container">Content</div>
<button onClick={handler}>Click</button>
<input type="text" value={$value} />

// Components
<MyComponent prop={$value} />
<Layout>
    <Header />
    <Content />
</Layout>

// Fragments
<>
    <h1>Title</h1>
    <p>Paragraph</p>
</>

// Expressions
<div>{$variable}</div>
<div>{$count * 2}</div>
<div>{$show ? 'Yes' : 'No'}</div>

// Lists
{array_map(fn($item) => <li>{$item}</li>, $items)}
```

## State Management

### useState Hook
```php
function Counter() {
    // Initialize state with default value
    [$count, $setCount] = useState(0);
    
    // Update state
    $increment = fn() => $setCount($count + 1);
    $decrement = fn() => $setCount($count - 1);
    
    // Functional update
    $double = fn() => $setCount(fn($prev) => $prev * 2);
    
    return (
        <div>
            <span>{$count}</span>
            <button onClick={$increment}>+</button>
            <button onClick={$decrement}>-</button>
            <button onClick={$double}>×2</button>
        </div>
    );
}
```

### Multiple States
```php
function Form() {
    [$name, $setName] = useState('');
    [$email, $setEmail] = useState('');
    [$submitted, $setSubmitted] = useState(false);
    
    $handleSubmit = function() use ($name, $email, $setSubmitted) {
        // Process form
        $setSubmitted(true);
    };
    
    return (
        <form onSubmit={$handleSubmit}>
            <input 
                value={$name}
                onChange={fn($e) => $setName($e->target->value)}
            />
            <input 
                value={$email}
                onChange={fn($e) => $setEmail($e->target->value)}
            />
            <button type="submit">Submit</button>
            {$submitted && <p>Form submitted!</p>}
        </form>
    );
}
```

## Development Patterns

### Component Composition
```php
function Layout($props) {
    return (
        <div className="layout">
            <header className="header">
                <Logo />
                <Navigation />
            </header>
            <main className="main">
                {$props['children']}
            </main>
            <footer className="footer">
                <Copyright />
            </footer>
        </div>
    );
}

// Usage
function App() {
    return (
        <Layout>
            <HomePage />
        </Layout>
    );
}
```

### Conditional Rendering
```php
function Message($props) {
    [$visible, $setVisible] = useState(true);
    
    return (
        <div>
            {$visible && (
                <div className="alert">
                    {$props['text']}
                    <button onClick={fn() => $setVisible(false)}>×</button>
                </div>
            )}
            {!$visible && (
                <button onClick={fn() => $setVisible(true)}>
                    Show message
                </button>
            )}
        </div>
    );
}
```

### List Rendering
```php
function TodoList() {
    [$todos, $setTodos] = useState([
        ['id' => 1, 'text' => 'Learn PHPX', 'done' => false],
        ['id' => 2, 'text' => 'Build app', 'done' => false]
    ]);
    
    $toggleTodo = function($id) use ($todos, $setTodos) {
        $updated = array_map(function($todo) use ($id) {
            if ($todo['id'] === $id) {
                $todo['done'] = !$todo['done'];
            }
            return $todo;
        }, $todos);
        $setTodos($updated);
    };
    
    return (
        <ul className="todo-list">
            {array_map(function($todo) use ($toggleTodo) {
                return (
                    <li key={$todo['id']} className={$todo['done'] ? 'done' : ''}>
                        <input 
                            type="checkbox"
                            checked={$todo['done']}
                            onChange={fn() => $toggleTodo($todo['id'])}
                        />
                        {$todo['text']}
                    </li>
                );
            }, $todos)}
        </ul>
    );
}
```

## Event Handling

### Supported Events
```php
// Click events
<button onClick={fn() => doSomething()}>Click</button>

// Form events
<input onChange={fn($e) => setValue($e->target->value)} />
<form onSubmit={fn($e) => { $e->preventDefault(); handleSubmit(); }}>

// Keyboard events
<input onKeyPress={fn($e) => {
    if ($e->key === 'Enter') submit();
}} />

// Mouse events
<div 
    onMouseEnter={fn() => setHover(true)}
    onMouseLeave={fn() => setHover(false)}
>
```

### Event Handler Patterns
```php
function EventDemo() {
    [$log, $setLog] = useState([]);
    
    $logEvent = function($message) use ($log, $setLog) {
        $setLog([...$log, $message . ' at ' . date('H:i:s')]);
    };
    
    return (
        <div>
            <button onClick={fn() => $logEvent('Button clicked')}>
                Log Click
            </button>
            <input 
                onFocus={fn() => $logEvent('Input focused')}
                onBlur={fn() => $logEvent('Input blurred')}
            />
            <div className="log">
                {array_map(fn($entry) => <div>{$entry}</div>, $log)}
            </div>
        </div>
    );
}
```

## Styling Integration

### CSS Classes
```php
// Static classes
<div className="container main-content">

// Dynamic classes
<button className={$active ? 'btn active' : 'btn'}>

// Computed classes
function getButtonClass($type, $size) {
    return "btn btn-{$type} btn-{$size}";
}
<button className={getButtonClass('primary', 'large')}>
```

### Inline Styles (Limited Support)
```php
// Currently requires style attribute as string
<div style="color: red; font-size: 16px;">
```

## Bootstrap Configuration

### Application Entry (`bootstrap.php`)
```php
<?php

require_once __DIR__ . '/vendor/autoload.php';

use Kambo\PHPX\Framework\Component;
use Kambo\PHPX\Framework\Runtime;

// Require compiled components
require_once __DIR__ . '/build/App.php';
require_once __DIR__ . '/build/MyButton.php';

// Create root component
$app = Component::create('App', []);

// Render to DOM
$runtime = new Runtime();
$runtime->render($app);
```

## Performance Optimization

### Component Optimization
```php
// Avoid creating functions in render
function BadExample() {
    [$items, $setItems] = useState([]);
    
    return (
        <div>
            {array_map(function($item) {
                // Function created on every render
                return <Item onClick={fn() => handleClick($item)} />;
            }, $items)}
        </div>
    );
}

// Better: Create handler outside
function GoodExample() {
    [$items, $setItems] = useState([]);
    
    $createHandler = fn($item) => fn() => handleClick($item);
    
    return (
        <div>
            {array_map(function($item) use ($createHandler) {
                return <Item onClick={$createHandler($item)} />;
            }, $items)}
        </div>
    );
}
```

### State Updates
```php
// Batch state updates
function MultiUpdate() {
    [$data, $setData] = useState([
        'name' => '',
        'email' => '',
        'phone' => ''
    ]);
    
    $updateAll = function($updates) use ($data, $setData) {
        $setData(array_merge($data, $updates));
    };
    
    return (
        <button onClick={fn() => $updateAll([
            'name' => 'John',
            'email' => 'john@example.com',
            'phone' => '555-1234'
        ])}>
            Update All
        </button>
    );
}
```

## Common Patterns

### Form Handling
```php
function ContactForm() {
    [$form, $setForm] = useState([
        'name' => '',
        'email' => '',
        'message' => ''
    ]);
    
    $updateField = function($field, $value) use ($form, $setForm) {
        $setForm(array_merge($form, [$field => $value]));
    };
    
    $handleSubmit = function($e) use ($form) {
        $e->preventDefault();
        // Submit form data
        console->log('Submitting:', $form);
    };
    
    return (
        <form onSubmit={$handleSubmit}>
            <input 
                value={$form['name']}
                onChange={fn($e) => $updateField('name', $e->target->value)}
                placeholder="Name"
            />
            <input 
                value={$form['email']}
                onChange={fn($e) => $updateField('email', $e->target->value)}
                placeholder="Email"
            />
            <textarea 
                value={$form['message']}
                onChange={fn($e) => $updateField('message', $e->target->value)}
                placeholder="Message"
            />
            <button type="submit">Send</button>
        </form>
    );
}
```

## Debugging

### Console Output
```php
function DebugComponent() {
    [$state, $setState] = useState(['debug' => true]);
    
    // Access console through VRZNO
    $window = new Vrzno;
    $window->console->log('Component rendered', $state);
    
    return (
        <div>
            <pre>{json_encode($state, JSON_PRETTY_PRINT)}</pre>
        </div>
    );
}
```

### Development Tools
- Browser DevTools for network and console
- Component state inspection via console logs
- Error boundaries for component errors

## Deployment Considerations

### Production Build
1. Compile PHPX files: `./compile.sh`
2. Build WebAssembly: `composer wasm`
3. Optimize assets (minify CSS, etc.)
4. Deploy `public/` directory

### Performance Tips
- Pre-compile components during build
- Enable browser caching for WASM files
- Use CDN for static assets
- Consider code splitting for large apps

## Limitations

### Current Limitations
- No hot module replacement
- Limited dev tools integration
- Manual compilation step required
- Some React features not yet implemented

### Framework Gaps
- No useEffect hook yet
- No context API
- No memo/callback optimization
- Limited error boundaries
