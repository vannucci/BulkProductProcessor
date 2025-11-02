.PHONY: start stop dev install clean help pb frontend watcher generate

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "📦 Installing dependencies..."
	cd frontend && npm install
	cd file_watcher && npm install
	cd product_generator && npm install
	@echo "✅ Dependencies installed"

pb: ## Start PocketBase only
	@echo "🗄️  Starting PocketBase..."
	./pocketbase serve

frontend: ## Start Frontend only
	@echo "⚛️  Starting Frontend..."
	cd frontend && npm run dev

watcher: ## Start File Watcher only
	@echo "👀 Starting File Watcher..."
	cd file_watcher && npm start

generate: ## Generate test products (usage: make generate COUNT=500)
	@echo "🎲 Generating products..."
	cd product_generator && npm run generate $(COUNT)

dev: ## Instructions to start all services
	@echo "🚀 Starting services..."
	@echo ""
	@echo "Run these commands in separate terminals:"
	@echo "  Terminal 1: make pb"
	@echo "  Terminal 2: make frontend"
	@echo "  Terminal 3: make watcher"
	@echo ""

stop: ## Stop all running services
	@echo "🛑 Stopping services..."
	@pkill -f "pocketbase serve" || true
	@pkill -f "vite" || true
	@pkill -f "file_watcher.js" || true
	@echo "✅ Services stopped"

clean: stop ## Clean all generated files
	@echo "🧹 Cleaning..."
	rm -rf frontend/node_modules
	rm -rf file_watcher/node_modules
	rm -rf product_generator/node_modules
	rm -rf frontend/dist
	rm -rf pb_public/*
	@echo "✅ Cleaned"

build: ## Build frontend for production
	@echo "🏗️  Building frontend..."
	cd frontend && npm run build
	@echo "✅ Built to pb_public/"