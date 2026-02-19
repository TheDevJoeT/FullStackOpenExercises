import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

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

  console.log("Countries loaded:", countries.length);

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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
