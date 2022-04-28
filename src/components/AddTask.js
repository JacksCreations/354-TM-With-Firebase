import React from 'react';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

const AddTask = ({ onAdd, saveTask }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    //validation
    if (name.length > 0) {
      //assigns each task a UUID
      var id = uuid();
      id = id.slice(0, 8);

      //set status
      let completed = false;
      onAdd({ id, name, description, completed });

      saveTask({ id, name, description, completed });

      //clears the text fields when submit
      setName('');
      setDescription('');
    } else {
      console.log('enter name of task');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label form="taskName" className="form-label">
          Task Name
        </label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label htmlFor="contentInput" className="form-label">
          Notes
        </label>
        <textarea
          className="form-control"
          id="contentInput"
          rows="2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div>
        <button type="submit" id="addTask">
          ADD TASK
        </button>
      </div>
    </form>
  );
};

export default AddTask;
