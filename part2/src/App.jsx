import Notes from "./components/Note";

const App = ({notes}) => {
  

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note) => (
          <Notes key= {note.id} note = {note}></Notes>
        ))}
      </ul>
    </div>
  );
};

export default App;
