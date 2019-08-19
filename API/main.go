package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	//"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
	_ "github.com/heroku/x/hmetrics/onload"
	"github.com/lib/pq"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"googlemaps.github.io/maps"
)

var db *sql.DB

var store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))

//UserInfo is name, password, and address combo
type UserInfo struct {
	Username  string   `json:"username" db:"username"`
	Password  string   `json:"password" db:"password"`
	Address   string   `json:"address1"`
	City      string   `json:"city"`
	State     string   `json:"state"`
	Latitude  float64  `db:"latitude"`
	Longitude float64  `db:"longitude"`
	Mains     []string `json:"mains" db:"mains"`
	Setup     []string `json:"setup" db:"setup"`
}

func main() {
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/register", registerHandler)
	http.HandleFunc("/sessiontest", sessionHandler)
	http.HandleFunc("/logout", logoutHandler)
	initDB()
	log.Fatal(http.ListenAndServe(getPort(), nil))
}

func logoutHandler(w http.ResponseWriter, r *http.Request) {
	//to identify which user the cookie belongs to
	creds := &UserInfo{}

	err := json.NewDecoder(r.Body).Decode(creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	session, err := store.Get(r, strings.ToLower(creds.Username))

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	//Delete session
	session.Options.MaxAge = -1
	session.Save(r, w)
}

func sessionHandler(w http.ResponseWriter, r *http.Request) {
	//get user info to  check for identity
	creds := &UserInfo{}

	err := json.NewDecoder(r.Body).Decode(creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	//attempt to fetch the session from user info
	session, err := store.Get(r, strings.ToLower(creds.Username))

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	//check if the session's authenticated value is true
	if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	//prep json return stuff
	testResponse := &UserInfo{
		Username:  session.Values["Username"].(string),
		Latitude:  session.Values["Lat"].(float64),
		Longitude: session.Values["Long"].(float64),
		Mains:     session.Values["Mains"].([]string),
		Setup:     session.Values["Setup"].([]string)}
	jsonResponse, err := json.Marshal(testResponse)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	creds := &UserInfo{}
	err := json.NewDecoder(r.Body).Decode(creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	result := db.QueryRow("SELECT password, latitude, longitude, username, mains, setup FROM users WHERE username=$1", strings.ToLower(creds.Username))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	storedCreds := &UserInfo{}

	//err = result.Scan(&storedCreds.Username, &storedCreds.Password, &storedCreds.Latitude, &storedCreds.Longitude, &storedCreds.Mains, &storedCreds.Setup)
	err = result.Scan(&storedCreds.Password, &storedCreds.Latitude, &storedCreds.Longitude, &storedCreds.Username, pq.Array(&storedCreds.Mains), pq.Array(&storedCreds.Setup))
	if err != nil {

		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		w.WriteHeader(http.StatusForbidden)
		return
	}

	if err = bcrypt.CompareHashAndPassword([]byte(storedCreds.Password), []byte(creds.Password)); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	//make session (session keys will be like user struct(keys will be all values of a user anf then stored to write and stuff))
	session, err := store.Get(r, strings.ToLower(storedCreds.Username))

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	session.Values["Username"] = strings.ToLower(storedCreds.Username)
	session.Values["Mains"] = storedCreds.Mains
	session.Values["Setup"] = storedCreds.Setup
	session.Values["Lat"] = storedCreds.Latitude
	session.Values["Long"] = storedCreds.Longitude
	session.Values["authenticated"] = true

	session.Values["BenBaller"] = "Johnny Deng"
	session.Save(r, w)
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

	if _, err = db.Query("INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6)", strings.ToLower(user.Username), string(safePass), userLocation[0], userLocation[1], pq.Array(user.Mains), pq.Array(user.Setup)); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
}

func convertAddrToCoords(addr, city, state string) []float64 {
	client, err := maps.NewClient(maps.WithAPIKey("API_KEY"))
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
