package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"golang.org/x/crypto/bcrypt"

	_ "github.com/lib/pq"
)

var db *sql.DB

//UserInfo is name and password combo
type UserInfo struct {
	Username string `json:"username" db:"username"`
	Password string `json:"password" db:"password"`
}

func main() {
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/register", registerHandler)
	initDB()
	log.Fatal(http.ListenAndServe(":8000", nil))
}

func loginHandler(w http.ResponseWriter, r *http.Request) {

}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	user := &UserInfo{}

	request := json.NewDecoder(r.Body).Decode(user)

	if request != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	safePass, err := bcrypt.GenerateFromPassword([]byte(user.Password), 4)

	if _, err = db.Query("INSERT INTO users VALUES ($1, $2)", user.Username, string(safePass)); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
}

func initDB() {
	var err error
	db, err = sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
}
