package main 

import (
	"log"
	"net/http"

	"auth-app/internal/auth"
	"auth-app/internal/config"
	"auth-app/internal/db"
	"auth-app/internal/middleware"
)


func main() {
	// Load application config
	cfg := config.Load()

	// Initialize database connection
	dbConn := db.NewPostgres(cfg.DatabaseURL)
	defer dbConn.Close()

	// Initialize auth handler
	handler := auth.NewHandler(dbConn, cfg.JWTSecret)

	// Router
	mux := http.NewServeMux()

	// Public routes
	mux.HandleFunc("/api/auth/signup", handler.SignUp)
	mux.HandleFunc("/api/auth/signin", handler.SignIn)

	// Protected routes
	mux.Handle("/api/me", handler.AuthMiddleware(
		http.HandlerFunc(handler.Me),
	))

	// Global middleware
	corsMux := middleware.CORSMiddleware(mux)

	addr := "0.0.0.0:" + cfg.Port
	log.Printf("Server running on %s\n", addr)

	log.Fatal(http.ListenAndServe(addr, corsMux))
}

// func main() {
// 	// Initializes a PostgreSQL database connection
// 	dbConn := db.NewPostgres()

// 	// Creates a new Handler instance to injects the database dependency
// 	handler := auth.NewHandler(dbConn)

// 	// Creates an HTTP request multiplexer (router)
// 	mux := http.NewServeMux()

// 	// Registers endpoints
// 	mux.HandleFunc("/api/auth/signup", handler.SignUp)
// 	mux.HandleFunc("/api/auth/signin", handler.SignIn)
// 	mux.Handle("/api/me", handler.AuthMiddleware(http.HandlerFunc(handler.Me)))

// 	// Wrap the mux with CORS middleware
//     corsMux := middleware.CORSMiddleware(mux)

// 	// logs for dev
// 	log.Println("Server running on :8080")
//     log.Fatal(http.ListenAndServe("0.0.0.0:8080", corsMux))

// }