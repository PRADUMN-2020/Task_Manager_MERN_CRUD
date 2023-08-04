import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
function CreateArea(props) {
  const [noteText, setNoteText] = useState({
    _id: "",
    title: "",
    content: "",
    status: "Pending",
  });
  const [warning, setWarning] = useState({
    title: false,
    content: false,
  });
  const [sameTitle, setSameTitle] = useState(false);

  function handleChange(event) {
    const { value, name } = event.target;
    setNoteText((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  // on sumbission of form
  function handleSubmit(event) {
    noteText._id = uuidv4();

    if (!noteText.title) {
      setWarning({ ...warning, title: true });
    } else {
      if (props.checkTitle(noteText.title)) {
        setSameTitle(true);
      } else {
        setSameTitle(false);
        if (warning.title) {
          setWarning((prevWarning) => ({
            ...prevWarning,
            title: false,
          }));
        }
        if (noteText.content.length === 0 && noteText.title.length < 10) {
          setWarning((prevWarning) => ({
            ...prevWarning,
            content: true,
          }));
        } else {
          if (warning.content) {
            setWarning((prevWarning) => ({
              ...prevWarning,
              content: false,
            }));
          }
          props.onAdd(noteText);
          setNoteText({
            title: "",
            content: "",
          });
        }
      }
    }
    event.preventDefault();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          name="title"
          placeholder="Title"
          value={noteText.title}
        />
        {warning.title && <p className="warning">This field cant be empty.</p>}
        {sameTitle && (
          <p className="warning">
            This title already exits please try another one.
          </p>
        )}
        <textarea
          onChange={handleChange}
          name="content"
          placeholder="Description...."
          rows="3"
          value={noteText.content}
        />
        {warning.content && (
          <p className="warning">This field cant be empty.</p>
        )}
        <button className="form-button" onClick={handleSubmit}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            class="bi bi-plus-lg"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default CreateArea;
