# Todo List Application

A full-stack Todo List application built with React (frontend) and Go (backend).

## Project Structure

```
Todo_list/
├── backend/          # Go backend server
│   ├── main.go       # Main server file
│   ├── go.mod        # Go module file
│   └── go.sum        # Go dependencies checksum
├── frontend/         # React frontend application
│   ├── src/          # React source code
│   ├── public/       # Public assets
│   ├── package.json  # Node.js dependencies
│   └── README.md     # Frontend documentation
├── src/              # Alternative frontend structure
├── main.go           # Root Go file
└── package.json      # Root package.json
```

## Technologies Used

- **Frontend**: React.js
- **Backend**: Go (Golang)
- **API**: RESTful API
- **Database**: In-memory storage (can be extended to use a database)

## Features

- ✅ Add new tasks
- ✅ Mark tasks as completed/incomplete
- ✅ Delete tasks
- ✅ Real-time updates
- ✅ Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Go (v1.16 or higher)
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd Todo_list
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install Go dependencies:
```bash
cd ../backend
go mod tidy
```

### Running the Application

1. Start the backend server:
```bash
cd backend
go run main.go
```
The backend will run on `http://localhost:8080`

2. Start the frontend development server:
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

Juan Alberto Solis Castro 