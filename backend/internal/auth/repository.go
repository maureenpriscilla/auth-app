package auth

import (
	"database/sql"
)

type DB interface {
	QueryRow(query string, args ...any) *sql.Row
	Exec(query string, args ...any) (sql.Result, error)
}

type Repository struct {
	db DB
}

func NewRepository(db DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) CreateUser(email, passwordHash string) error {
	_, err := r.db.Exec(
		`INSERT INTO users (email, password_hash) VALUES ($1, $2)`,
		email,
		passwordHash,
	)
	return err
}

func (r *Repository) GetUserByEmail(email string) (*User, error) {
	u := &User{}
	err := r.db.QueryRow(
		`SELECT id, email, password_hash FROM users WHERE email = $1`,
		email,
	).Scan(&u.ID, &u.Email, &u.PasswordHash)

	if err != nil {
		return nil, err
	}

	return u, nil
}

