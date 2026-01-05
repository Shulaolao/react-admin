# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 项目目录结构

```
react-app/
├── public/                    # 静态资源目录
│   ├── favicon.ico           # 网站图标
│   ├── index.html            # 主HTML文件
│   ├── manifest.json         # PWA配置文件
│   └── robots.txt            # 搜索引擎爬虫配置
├── src/                      # 源代码目录
│   ├── assets/               # 静态资源
│   │   ├── images/           # 图片资源
│   │   ├── icons/            # 图标资源
│   │   └── fonts/            # 字体文件
│   ├── components/           # 通用组件
│   │   ├── Button/
│   │   ├── Header/
│   │   └── Footer/
│   ├── pages/                # 页面组件
│   │   ├── Home/
│   │   ├── About/
│   │   └── Contact/
│   ├── hooks/                # 自定义React Hooks
│   │   ├── useAuth.ts
│   │   └── useLocalStorage.ts
│   ├── utils/                # 工具函数
│   │   ├── helpers.ts
│   │   └── constants.ts
│   ├── services/             # API服务
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── context/              # React Context
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── styles/               # 全局样式
│   │   ├── globals.css
│   │   └── variables.css
│   ├── tests/                # 测试文件
│   │   ├── components/
│   │   └── pages/
│   ├── types/                # TypeScript类型定义
│   │   ├── index.d.ts
│   │   └── api.d.ts
│   ├── App.tsx               # 根组件
│   ├── App.css               # App组件样式
│   ├── index.tsx             # 应用入口文件
│   └── index.css             # 全局样式
├── .gitignore                # Git忽略文件配置
├── package.json              # 项目依赖和脚本配置
├── README.md                 # 项目说明文档
├── tsconfig.json             # TypeScript配置
├── vite.config.ts            # Vite构建工具配置
├── eslint.config.js          # ESLint配置
└── pnpm-lock.yaml            # 依赖锁定文件
```
