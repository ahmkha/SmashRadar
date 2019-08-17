package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/heroku/x/hmetrics/onload"
	"github.com/lib/pq"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"googlemaps.github.io/maps"
)

var db *sql.DB

//var store = sessions.NewCookieStore(os.Getenv("SESSION_KEY"))

//UserInfo is name, password, and address combo
type UserInfo struct {
	Username string   `json:"username" db:"username"`
	Password string   `json:"password" db:"password"`
	Address  string   `json:"address1"`
	City     string   `json:"city"`
	State    string   `json:"state"`
	Location Location `db:"address"`
	Mains    []string `json:"mains" db:"mains"`
	Setup    []string `json:"setup" db:"setup"`
}

//Location is the point location of a user from the db
type Location struct {
	Latitude  float64
	Longitude float64
}

func main() {
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/register", registerHandler)
	initDB()
	log.Fatal(http.ListenAndServe(getPort(), nil))
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	creds := &UserInfo{}
	err := json.NewDecoder(r.Body).Decode(creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	result := db.QueryRow("SELECT password FROM users WHERE username=$1", creds.Username)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	storedCreds := &UserInfo{}

	err = result.Scan(&storedCreds.Password)
	if err != nil {

		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if err = bcrypt.CompareHashAndPassword([]byte(storedCreds.Password), []byte(creds.Password)); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	user := &UserInfo{}

	request := json.NewDecoder(r.Body).Decode(user)

	if request != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	safePass, err := bcrypt.GenerateFromPassword([]byte(user.Password), 4)

	userLocation := convertAddrToCoords(user.Address, user.City, user.State)

	if _, err = db.Query("INSERT INTO users VALUES ($1, $2, POINT($3, $4), $5, $6)", user.Username, string(safePass), userLocation[0], userLocation[1], pq.Array(user.Mains), pq.Array(user.Setup)); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
}

func convertAddrToCoords(addr, city, state string) []float64 {
	client, err := maps.NewClient(maps.WithAPIKey("API KEY"))
	if err != nil {
		//return some error
		log.Fatalf("No working mang :(")
	}

	addrString := addr + ", " + city + ", " + state
	geocodeReq := &maps.GeocodingRequest{
		Address: addrString,
	}

	coordinates, err := client.Geocode(context.Background(), geocodeReq)

	if err != nil {
		//return some error
		log.Fatalf("No geocode mang :(")
	}

	coords := []float64{coordinates[0].Geometry.Location.Lat, coordinates[0].Geometry.Location.Lng}

	return coords
}

func initDB() {
	var err error
	db, err = sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
}

func getPort() string {
	var port = os.Getenv("PORT")
	if port == "" {
		port = "5000"
		fmt.Println("INFO: No PORT environment variable detected, defaulting to " + port)
	}
	return ":" + port
}
