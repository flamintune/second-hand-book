# todo 编写启动这个项目的make file指令
# 项目启动指令

# 安装依赖
install:
	npm install

# 开发环境运行
dev:
	npm run dev

# 构建项目
build:
	npm run build

# 代码检查
lint:
	npm run lint

# 预览构建后的项目
preview:
	npm run preview

# 默认任务，运行开发环境
.DEFAULT_GOAL := dev

# 帮助信息
help:
	@echo "可用的 make 指令:"
	@echo "  make install  - 安装项目依赖"
	@echo "  make dev      - 启动开发服务器"
	@echo "  make build    - 构建项目"
	@echo "  make lint     - 运行代码检查"
	@echo "  make preview  - 预览构建后的项目"
	@echo "  make help     - 显示此帮助信息"

create:
	sh create-componets-file.sh

.PHONY: install dev build lint preview help

