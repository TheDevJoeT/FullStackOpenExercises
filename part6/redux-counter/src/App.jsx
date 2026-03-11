import NoteForm from "./components/NoteForm";
import Notes from "./components/Notes";
import VisibilityFilter from "./components/VisibilityFilter";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeNotes } from "./reducers/noteReducer";
import noteServices from "./services/notes";


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
   dispatch(initializeNotes())
  }, [dispatch]);
  return (
    <div>
      <NoteForm />
      <VisibilityFilter />
      <Notes />
    </div>
  );
};

export default App;
