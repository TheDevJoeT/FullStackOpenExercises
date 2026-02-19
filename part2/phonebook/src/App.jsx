import { useState, useEffect } from "react";
import personService from "./services/persons";

const Filter = ({ filter, onChange }) => (
  <div>
    filter shown with
    <input value={filter} onChange={onChange} />
  </div>
);

const PersonForm = ({
  onSubmit,
  newName,
  newNumber,
  onNameChange,
  onNumberChange,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name:
      <input value={newName} onChange={onNameChange} />
    </div>
    <div>
      number:
      <input value={newNumber} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons, handleDelete }) => (
  <ul>
    {persons.map((person) => (
      <li key={person.id}>
        {person.name} {person.number}
        <button onClick={() => handleDelete(person.id, person.name)}>
          delete
        </button>
      </li>
    ))}
  </ul>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingPerson = persons.find(
      (person) => person.name === newName
    );

    // 🔥 If person exists → UPDATE
    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (!confirmUpdate) return;

      const updatedPerson = {
        ...existingPerson,
        number: newNumber,
      };

      personService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons((prev) =>
            prev.map((person) =>
              person.id === existingPerson.id
                ? returnedPerson
                : person
            )
          );
          setNewName("");
          setNewNumber("");
        });

      return;
    }

    // 🆕 Otherwise create new person
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personService.create(newPerson).then((returnedPerson) => {
      setPersons((prev) => prev.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });
  };

  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`);
    if (!confirmDelete) return;

    personService.remove(id).then(() => {
      setPersons((prev) =>
        prev.filter((person) => person.id !== id)
      );
    });
  };

  const handleFilterChange = (e) => setFilter(e.target.value);

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={handleSubmit}
        newName={newName}
        newNumber={newNumber}
        onNameChange={(e) => setNewName(e.target.value)}
        onNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
