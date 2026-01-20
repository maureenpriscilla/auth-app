package auth

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"auth-app/internal/db"

	_ "github.com/lib/pq"
)

func newTestHandler(t *testing.T) *Handler {
	dbURL := os.Getenv("DATABASE_URL") // use existing DB
	if dbURL == "" {
		t.Fatal("DATABASE_URL not set")
	}

	dbConn := db.NewPostgres(dbURL)

	// Clean users table before each test
	_, err := dbConn.Exec("TRUNCATE TABLE users RESTART IDENTITY;")
	if err != nil {
		t.Fatal(err)
	}

	return NewHandler(dbConn, []byte("testsecret"))
}


func TestSignUpAndSignIn(t *testing.T) {
	handler := newTestHandler(t)

	// --- SignUp ---
	signUpPayload := signUpRequest{
		Email:    "user@test.com",
		Password: "password123",
	}
	body, _ := json.Marshal(signUpPayload)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/signup", bytes.NewBuffer(body))
	w := httptest.NewRecorder()
	handler.SignUp(w, req)
	if w.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d", w.Code)
	}

	// --- SignIn ---
	signInPayload := signInRequest{
		Email:    "user@test.com",
		Password: "password123",
	}
	body, _ = json.Marshal(signInPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/auth/signin", bytes.NewBuffer(body))
	w = httptest.NewRecorder()
	handler.SignIn(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var tokenResp tokenResponse
	if err := json.NewDecoder(w.Body).Decode(&tokenResp); err != nil {
		t.Fatal("failed to decode token response")
	}
	if tokenResp.Token == "" {
		t.Fatal("expected a JWT token, got empty string")
	}
}
