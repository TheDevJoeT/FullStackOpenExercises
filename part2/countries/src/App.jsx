import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
  axios
    .get("https://restcountries.com/v3.1/all?fields=name,capital,area,flags,languages,cca3")
    .then(response => {
      setCountries(response.data)
    })
}, [])


  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase()),
  );

  console.log("Countries loaded:", countries.length)

  return (
    <div>
      <div>
        find countries{" "}
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {search && (
        <>
          {filteredCountries.length > 10 && (
            <div>Too many matches, specify another filter</div>
          )}

          {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
            <div>
              {filteredCountries.map((country) => (
                <div key={country.cca3}>{country.name.common}</div>
              ))}
            </div>
          )}

          {filteredCountries.length === 1 && (
            <div>
              <h2>{filteredCountries[0].name.common}</h2>

              <div>Capital {filteredCountries[0].capital?.[0]}</div>

              <div>Area {filteredCountries[0].area}</div>

              <h3>Languages</h3>
              <ul>
                {Object.values(filteredCountries[0].languages || {}).map(
                  (lang) => (
                    <li key={lang}>{lang}</li>
                  ),
                )}
              </ul>

              <img
                src={filteredCountries[0].flags.png}
                alt="flag"
                width="200"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
