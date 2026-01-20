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
