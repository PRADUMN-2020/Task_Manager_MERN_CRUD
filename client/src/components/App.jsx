import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreatArea";
import Edit from "./Edit";

function App() {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(false);
  const [editText, setEditText] = useState({});
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get("/api/tasks");
    setNotes(response.data);
  };

  async function addNote(noteText) {
    console.log(noteText);
    try {
      const response = await axios.post("/api/tasks", { noteText });
      console.log("Task created:", response.data);
      setNotes((prevNotes) => {
        return [...prevNotes, noteText];
      });
      // Refresh tasks or update state to reflect new task
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }

  async function deleteNote(id) {
    console.log(id);
    try {
      const response = await axios.delete(`/api/tasks/${id}`);
      console.log("Task deleted:", response.data);

      // Update state to remove the deleted task from the notes
      setNotes((prevNotes) => {
        return prevNotes.filter((note) => note._id !== id);
      });

      // Refresh tasks or update state as needed
    } catch (error) {
      console.error("Error deleting task:", error); // Update error message
    }
  }

  function editFun(editdText) {
    setEditText(editdText);
    setEditNote(true);
  }
  async function confirmEdit(editText, id) {
    setEditNote(false);

    try {
      const response = await axios.patch(`/api/tasks/${id}`, editText);
      console.log("Task Updated:", response.data);

      setEditNote(false);
    } catch (error) {
      console.error("Error editing task:", error); // Update error message
    }
  }

  function checkTitle(title, id = null, edit = false) {
    var ans = false;
    var arr = notes;
    if (!edit) {
      arr.forEach((note, index) => {
        if (note.title === title) {
          ans = true;
        }
      });
    } else {
      arr.forEach((note, index) => {
        if (note.title === title) {
          if (note._id !== id) ans = true;
        }
      });
    }

    return ans;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Header />
      {editNote ? (
        <Edit
          title={editText.title}
          content={editText.content}
          confirmEdit={confirmEdit}
          status={editText.status}
          _id={editText._id}
          checkTitle={checkTitle}
        />
      ) : (
        <div>
          <CreateArea onAdd={addNote} checkTitle={checkTitle} />
          <div class="container text-center">
            <div class="row">
              {notes &&
                notes.map((currNote, index) => {
                  return (
                    <Note
                      key={currNote._id}
                      title={currNote.title}
                      content={currNote.content}
                      status={currNote.status}
                      _id={currNote._id}
                      onDelete={deleteNote}
                      onEdit={editFun}
                      checkTitle={checkTitle}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
