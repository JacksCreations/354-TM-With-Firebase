import React from 'react';
import Task from './Task';

const Tasks = ({ tasks, onDelete, completed, uncompleted, feed }) => {
  function displayFeed() {
    if (feed == 0) {
      {
        return tasks.map((task) => (
          <Task key={task.id} task={task} onDelete={onDelete} />
        ));
      }
    } else if (feed == 1) {
      {
        if (uncompleted.length == 0) {
          return (
            <center>
              <h1 id="notasks">Congrats you have no tasks</h1>
            </center>
          );
        } else {
          return uncompleted.map((task) => (
            <Task key={task.id} task={task} onDelete={onDelete} />
          ));
        }
      }
    } else if (feed == 2) {
      return completed.map((task) => (
        <Task key={task.id} task={task} onDelete={onDelete} />
      ));
    }
  }

  return (
    <div className="TaskBox">
      <div>{displayFeed()}</div>
    </div>
  );
};
export default Tasks;

/*

{tasks.map((task) => (
        <Task key={task.id} task={task} onDelete={onDelete} />
      ))}


*/
