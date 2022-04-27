import React from 'react';

const Task = ({ task, onDelete }) => {
  function detectNotes() {
    let isEmpty = String(task.description).length;
    if (isEmpty > 0) {
      return <div className="notes">Notes: {task.description}</div>;
    }
  }

  if (task.completed === true) {
    return (
      <div className="taskBox">
        <h3 className="name">{task.name}</h3>
        <div>{detectNotes()}</div>
      </div>
    );
  } else {
    return (
      <div className="taskBoxUncompleted">
        <h3 className="name">
          {task.name}
          <button className="complete" onClick={() => onDelete(task)}>
            ✓
          </button>
        </h3>
        <div>{detectNotes()}</div>
      </div>
    );
  }
};

export default Task;
