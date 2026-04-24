# 钻孔桩工程工具

一个基于 React + Vite 的静态工程网页项目，可直接部署到 GitHub Pages，无需传统服务器。项目包含两个页面：

- 钻孔桩成孔进度
- 导管提管与混凝土灌注模拟

## 本地运行

1. 安装依赖

```bash
npm install
```

2. 启动开发环境

```bash
npm run dev
```

3. 运行测试

```bash
npm test
```

4. 生成发布文件

```bash
npm run build
```

构建结果会输出到 `dist/`，这是部署到 GitHub Pages 的静态文件目录。

## 部署到 GitHub Pages

本项目已经使用 `HashRouter` 和相对 `base` 配置，适合 GitHub Pages 静态托管。

### 手动部署

1. 在 GitHub 创建仓库并推送代码
2. 本地执行：

```bash
npm run build
```

3. 将 `dist/` 目录内容发布到仓库的 `gh-pages` 分支，或上传到 Pages 指定的静态目录
4. 在 GitHub 仓库设置中启用 GitHub Pages

### 使用 GitHub Actions 自动部署

仓库里已经包含工作流文件：

- `.github/workflows/deploy-pages.yml`

它会在推送到 `main` 或 `master` 分支时自动执行：

1. `npm ci`
2. `npm test`
3. `npm run build`
4. 自动发布 `dist/` 到 GitHub Pages

首次启用时请在 GitHub 仓库中确认以下设置：

1. 打开 `Settings > Pages`
2. `Build and deployment` 下的 `Source` 选择 `GitHub Actions`
3. 推送代码到 `main` 或 `master` 分支

之后每次推送都会自动重新部署。

## 数据保存

当前版本使用 `localStorage` 自动保存并恢复两个页面的数据。存储逻辑已经通过适配器封装，入口在：

- `src/lib/storage.js`

## 后续接入 Firebase Realtime Database

当前代码预留了 Firebase Realtime Database 接口，可以按以下步骤扩展：

1. 安装 Firebase SDK

```bash
npm install firebase
```

2. 创建 Firebase 项目并开启 Realtime Database

3. 新增一个 Firebase 适配器，例如：

- `src/lib/firebase.js`
- `src/lib/storage.js` 中补充 `createFirebaseAdapter`

4. 将页面里使用的 `createLocalStorageAdapter(...)` 替换为 Firebase 适配器，或做成本地 + 云端双写

5. 推荐的数据结构

```json
{
  "users": {
    "demo-user": {
      "drillingProgress": {},
      "tremiePlacement": {}
    }
  }
}
```

6. 如果要做多人协作，可在适配器层增加：

- 用户身份标识
- 页面级时间戳
- 数据版本号
- 监听云端变更后的状态同步

## 项目特点

- React 实现，适合后续继续扩展
- 响应式布局，支持手机和电脑浏览器
- SVG 实时示意图
- 所有关键数值统一保留 2 位小数
- 本地持久化已就位，便于继续接入 Firebase
