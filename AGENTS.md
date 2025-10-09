# Repository Guidelines

## 项目结构与模块组织
- ackend/：Django API 与服务（应用在 ackend/backend/*；测试 ackend/tests/；配置 ackend/config/；静态与模板 ackend/backend/static、ackend/backend/templates）。
- rontend/：Vue 3 + Vite（源码 src/；静态 public/）。
- jupyterlab-cpw/：自研 JupyterLab 4 插件（TS+Python，混用 pnpm 与 jlpm 脚本，产物在 jupyterlab_cpw/labextension）。
- jupyterhub-charts/：用于部署 JupyterHub 的 Helm values 与安装脚本。
- lb/：仅包含 Nginx 反向代理镜像定义（Dockerfile、
ginx.conf、logo），用于与前后端配合统一对外暴露。
- docs/：运维/开发文档。

## 构建、测试与本地开发
- 后端：cd backend; python -m venv .venv（Win：.venv\Scripts\activate；POSIX：. .venv/bin/activate）；安装依赖：pip install -r requirements.txt；启动：python manage.py runserver；测试：pytest -q（启用 --ds=config.settings.test --reuse-db）；或 docker compose -f docker-compose.local.yml up --build。
- 前端：cd frontend; pnpm install；开发：pnpm dev；构建：pnpm build；格式化：pnpm lint:fix。
- JupyterLab 插件：cd jupyterlab-cpw; pnpm install；构建：pnpm run build（生产：pnpm run build:prod）；监听：pnpm run watch 或 jlpm watch；联调：pip install -e "." && jupyter labextension develop . --overwrite && jupyter lab。
- JupyterHub：cd jupyterhub-charts; bash install.sh（调用 helm upgrade --install -n lab --values values-<ver>.yaml）。
- Nginx 反代：cd lb; docker build -t lab-nginx . && docker run -p 80:80 lab-nginx。

## 代码风格与命名
- Python：Ruff + MyPy；4 空格；模块/函数 snake_case，类 PascalCase；模板用 djLint。
- Vue/TS：ESLint（2 空格、单引号、无分号）；组件文件 kebab-case（如 user-profile.vue），组件名 PascalCase；提交前运行：uff check .、mypy .、pnpm -C frontend lint:fix。

## 测试规范
- 后端：测试放在 ackend/tests/test_*.py；目标覆盖率约 80%；pytest -q；覆盖率由 django_coverage_plugin 在 pyproject.toml 配置。
- 前端：如新增测试，建议 Vitest，命名 *.spec.ts 放于 src/。

## 提交与 Pull Request
- 使用 Conventional Commits：eat、ix、docs、efactor、	est、chore（例：eat(api): add lesson detail endpoint）。
- PR：聚焦单一变更；补充说明、关联 issue、UI 截图；确保测试/检查通过；涉及行为变更请同步更新文档。
- 安全：勿提交机密；使用 ackend/.envs 管理本地与样例环境变量。
