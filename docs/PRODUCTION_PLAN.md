# Production Preparation Plan

This document proposes a sequence of pull requests (PRs) to get the Todo List application ready for production deployment. Each PR should include automated tests to ensure stability before merging.

## Current Repository State
- The Go backend (`backend/main.go`) serves tasks from an in-memory map and exposes basic CRUD endpoints. Example lines:
  ```go
  type Task struct { // lines 14-20
      ID        int    `json:"id"`
      Text      string `json:"text"`
      Completed bool   `json:"completed"`
      Status    string `json:"status"`
      StartDate string `json:"startDate"`
      EndDate   string `json:"endDate"`
  }
  ```
- The React frontend (`frontend/src/App.js`) fetches tasks from the backend and allows editing them on a simple board. Example lines:
  ```javascript
  const API_URL = 'http://localhost:8080/tasks'; // line 4
  function App() {
      const [tasks, setTasks] = useState([]);
      // ...
  }
  ```
- The repository also contains older code at the root (`main.go` and `src/`) which duplicates functionality.
- There are almost no automated tests; `frontend/src/App.test.js` only contains a placeholder test.
- The README is truncated at the end.

## Suggested Pull Request Roadmap
1. **Cleanup and Documentation**
   - Remove the outdated root `src` directory and `main.go` to avoid confusion.
   - Fix the trailing lines in `README.md` and document how to run both frontend and backend.
   - Create a `docs/` directory (this file can be part of that PR).

2. **Backend Persistence and Configuration**
   - Replace the in-memory `tasks` map with a database (SQLite or PostgreSQL).
   - Introduce environment variables for server port and database connection.
   - Provide database migration scripts.

3. **Backend Testing**
   - Add Go unit tests for each handler (e.g., `getTasks`, `createTask`, etc.).
   - Use an in-memory database or mocks during testing.
   - Ensure `go test ./...` runs without external network access.

4. **Frontend Testing**
   - Expand tests with Jest and React Testing Library.
   - Cover task creation, editing, and status changes.
   - Ensure `npm test` passes in CI.

5. **Continuous Integration**
   - Set up GitHub Actions to run `go test` and `npm test` on every PR.
   - Add linting steps (`gofmt`, `go vet`, `eslint`).

6. **Dockerization and Deployment**
   - Provide Dockerfiles for backend and frontend.
   - Create a `docker-compose.yml` for local development and a production variant.
   - Document the deployment process.

7. **Release PR**
   - Once all previous PRs are merged and tests pass, open a final PR to tag the production release.

## Verification Strategy
- Every PR should include new or updated tests.
- CI must report success before merging.
- Manual QA can follow after CI for final checks.
