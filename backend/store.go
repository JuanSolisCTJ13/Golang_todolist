package main

import (
	"database/sql"
)

// TaskStore provides database operations for tasks.
type TaskStore struct {
	db *sql.DB
}

// NewTaskStore creates a store with the given database handle.
func NewTaskStore(db *sql.DB) *TaskStore {
	return &TaskStore{db: db}
}

// GetAll returns all tasks from the database.
func (s *TaskStore) GetAll() ([]Task, error) {
	rows, err := s.db.Query(`SELECT id, text, completed, status, start_date, end_date FROM tasks`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.Text, &t.Completed, &t.Status, &t.StartDate, &t.EndDate); err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}
	return tasks, rows.Err()
}

// Create inserts a new task into the database.
func (s *TaskStore) Create(t *Task) error {
	res, err := s.db.Exec(`INSERT INTO tasks (text, completed, status, start_date, end_date) VALUES (?, ?, ?, ?, ?)`,
		t.Text, t.Completed, t.Status, t.StartDate, t.EndDate)
	if err != nil {
		return err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	t.ID = int(id)
	return nil
}

// Update modifies an existing task.
func (s *TaskStore) Update(id int, t Task) error {
	_, err := s.db.Exec(`UPDATE tasks SET text = ?, completed = ?, status = ?, start_date = ?, end_date = ? WHERE id = ?`,
		t.Text, t.Completed, t.Status, t.StartDate, t.EndDate, id)
	return err
}

// Delete removes a task from the database.
func (s *TaskStore) Delete(id int) error {
	_, err := s.db.Exec(`DELETE FROM tasks WHERE id = ?`, id)
	return err
}

// GetByID retrieves a task by id.
func (s *TaskStore) GetByID(id int) (Task, error) {
	var t Task
	err := s.db.QueryRow(`SELECT id, text, completed, status, start_date, end_date FROM tasks WHERE id = ?`, id).
		Scan(&t.ID, &t.Text, &t.Completed, &t.Status, &t.StartDate, &t.EndDate)
	return t, err
}
