import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://restcountries.com/v3.1/all?fields=name,capital,area,flags,languages,cca3",
      )
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase()),
  );

  const countryToShow =
    selectedCountry ||
    (filteredCountries.length === 1 ? filteredCountries[0] : null);

  useEffect(() => {
  if (!countryToShow) return

  const apiKey = import.meta.env.VITE_WEATHER_KEY
  const capital = countryToShow.capital?.[0]

  setWeather(null)

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
    )
    .then(response => {
      setWeather(response.data)
    })
    .catch(error => {
      console.error("Weather fetch failed:", error)
    })

}, [countryToShow])



  return (
    <div>
      <div>
        find countries{" "}
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedCountry(null);
          }}
        />
      </div>

      {search && (
        <>
          {!countryToShow && filteredCountries.length > 10 && (
            <div>Too many matches, specify another filter</div>
          )}

          {!countryToShow &&
            filteredCountries.length <= 10 &&
            filteredCountries.length > 1 && (
              <div>
                {filteredCountries.map((country) => (
                  <div key={country.cca3}>
                    {country.name.common}
                    <button onClick={() => setSelectedCountry(country)}>
                      show
                    </button>
                  </div>
                ))}
              </div>
            )}

          {countryToShow && (
            <div>
              <h2>{countryToShow.name.common}</h2>

              <div>Capital {countryToShow.capital?.[0]}</div>
              <div>Area {countryToShow.area}</div>

              <h3>Languages</h3>
              <ul>
                {Object.values(countryToShow.languages || {}).map((lang) => (
                  <li key={lang}>{lang}</li>
                ))}
              </ul>

              <img src={countryToShow.flags.png} alt="flag" width="200" />

              {weather && (
                <div>
                  <h3>Weather in {countryToShow.capital?.[0]}</h3>

                  <div>Temperature {weather.main.temp} °C</div>

                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt="weather icon"
                  />

                  <div>Wind {weather.wind.speed} m/s</div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
