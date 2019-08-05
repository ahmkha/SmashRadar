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
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"googlemaps.github.io/maps"
)

var db *sql.DB

//UserInfo is name, password, and address combo
type UserInfo struct {
	Username string `json:"username" db:"username"`
	Password string `json:"password" db:"password"`
	Address  string `json:"address1"`
	City     string `json:"city"`
	State    string `json:"state"`
}

func main() {
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/register", registerHandler)
	initDB()
	log.Fatal(http.ListenAndServe(getPort(), nil))
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Working or nah")
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

	if _, err = db.Query("INSERT INTO userstest VALUES ($1, $2, POINT($3, $4))", user.Username, string(safePass), userLocation[0], userLocation[1]); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
}

func convertAddrToCoords(addr, city, state string) []float64 {
	client, err := maps.NewClient(maps.WithAPIKey("apikey"))
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
