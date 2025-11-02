# Product Search & Import System

## Summary

A full-stack product catalog system demonstrating scalable data ingestion and search capabilities. Built to answer the question: "How would you scale a simple product lookup to handle real-world import volumes and user search needs?"

**Features:**
- **Inverted Index Search**: Fast keyword-based product lookup using a word index
- **Smart CSV Import Pipeline**: File upload → validation → processing with duplicate detection at both file-level (MD5 hashing) and product-level
- **Real-time File Watching**: Automatic registration of CSV files dropped into the import directory
- **Status Tracking**: Complete visibility into the import lifecycle (pending → processing → complete/error)
- **Authentication**: Secure user login with session management

**Tech Stack:** React + PocketBase (embedded database with real-time capabilities)

## Quick Start
```bash
# Install dependencies
make install

# Start all services (follow instructions to run in 3 terminals)
make dev

# Or start services individually:
make pb        # Terminal 1: PocketBase backend
make frontend  # Terminal 2: React dev server
make watcher   # Terminal 3: CSV file watcher

# View all available commands
make help
```

**Access the application:** http://localhost:5173

**Admin panel:** http://localhost:8090/_/

## How It Works

1. **Upload CSV** via the UI or drop files into `import_files/`
2. **File Watcher** auto-registers new CSV files with MD5 hash
3. **Manual Processing** trigger validates and imports products
4. **Search** uses inverted index for fast keyword lookups

## Architecture Highlights

- **Backend Hooks**: PocketBase hooks automatically build the search index on product insertion
- **Separation of Concerns**: File registration, validation, and processing are distinct stages
- **Duplicate Prevention**: Hash-based file deduplication + product-level uniqueness checks
- **Scalability Considerations**: Inverted index structure allows efficient search without scanning all products

## Future Enhancements

**High Priority:**
- Real-time status updates using PocketBase subscriptions (eliminate manual refresh)
- Progress tracking for large CSV imports with ETA calculation
- Multi-word search support and search-as-you-type
- Enhanced error handling with retry mechanisms

**Production Readiness:**
- Import analytics dashboard (processing times, success rates, most searched terms)
- Batch processing for very large files (chunked uploads)
- Pre-upload CSV validation and format verification
- Comprehensive logging and observability

**User Experience:**
- Polished UI with loading states and smooth transitions
- Toast notifications for async operations
- Bulk actions (delete multiple products, re-process failed imports)
- Export functionality (filtered results to CSV)

## Additional Commands
```bash
make build  # Build frontend for production
make stop   # Stop all running services
make clean  # Remove dependencies and build artifacts
```