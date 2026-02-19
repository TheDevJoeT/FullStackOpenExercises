import { useState, useEffect } from "react";
import personService from "./services/persons";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingPerson = persons.find(
      (person) => person.name === newName
    );

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

          showNotification(
            `Updated ${returnedPerson.name}`,
            "success"
          );

          setNewName("");
          setNewNumber("");
        })
        .catch(() => {
          showNotification(
            `Information of ${existingPerson.name} has already been removed from server`,
            "error"
          );

          setPersons((prev) =>
            prev.filter(
              (person) => person.id !== existingPerson.id
            )
          );
        });

      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personService.create(newPerson).then((returnedPerson) => {
      setPersons((prev) => prev.concat(returnedPerson));

      showNotification(
        `Added ${returnedPerson.name}`,
        "success"
      );

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

      <Notification
        message={notification}
        type={notificationType}
      />

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

      <Persons
        persons={personsToShow}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
