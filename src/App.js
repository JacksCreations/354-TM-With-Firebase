import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import './style.css';
import AddTask from './components/AddTask';
import Tasks from './components/Tasks';
import Header from './components/Header';
import { firestore } from './components/firebase';
import {
  updateDoc,
  collection,
  setDoc,
  doc,
  getDocs,
} from '@firebase/firestore';

const App = () => {
  const [feed, setFeed] = useState(0);

  //test feed
  const [tasks, setTasks] = useState([]);

  const [uncompleted, setUncompleted] = useState(
    tasks.filter((task) => task.completed == false)
  );

  const [completed, setCompleted] = useState(
    tasks.filter((task) => task.completed == true)
  );

  // Add Task
  const addTask = async (task) => {
    setTasks([...tasks, task]);
    setUncompleted([...uncompleted, task]);
    //console.log(tasks);
  };

  const completeTask = (task) => {
    task.completed = true;
    updateToCompleted(task); //
    setTasks([...tasks]);
    removeFromTodo();
    //getAll();
  };

  //function UPDATES THE COMPLETED BOOLEAN TO TRUE
  //WORKING
  async function updateToCompleted(task) {
    const taskRef = doc(firestore, 'tasks', task.id);

    await updateDoc(taskRef, {
      completed: true,
    });
  }

  //Shows all tasks
  function getAll() {
    setFeed(0);
    setTasks([...tasks]);
  }

  //shows all uncompleted tasks
  function getUncompleted() {
    setFeed(1); //the error i was running into was because the complete task would call uncompleted and
    //set the feed back to the uncompleted task feed
    let uncompleted = tasks.filter((task) => task.completed === false);

    setUncompleted(uncompleted);
  }

  //removes task from to do if checked as completed
  function removeFromTodo() {
    let uncompleted = tasks.filter((task) => task.completed === false);

    uncompleted.forEach((task, index) => {
      if (task.completed === true) {
        uncompleted.splice(index, 1);
      }
    });

    setUncompleted(uncompleted);
  }

  //shows all completed tasks
  function getCompleted() {
    setFeed(2);
    let completed = tasks.filter((task) => task.completed == true);
    setCompleted(completed);
  }

  //changes the color of the feed buttons when selected
  function feedButtonIndicator() {
    if (feed == 0) {
      return (
        <div>
          <button id="selectedFeedButton" onClick={() => getAll()}>
            All Tasks
          </button>
          <button className="feedButtons" onClick={() => getUncompleted()}>
            To Do
          </button>
          <button className="feedButtons" onClick={() => getCompleted()}>
            Completed
          </button>
        </div>
      );
    } else if (feed == 1) {
      return (
        <div>
          <button className="feedButtons" onClick={() => getAll()}>
            All Tasks
          </button>
          <button id="selectedFeedButton" onClick={() => getUncompleted()}>
            To Do
          </button>
          <button className="feedButtons" onClick={() => getCompleted()}>
            Completed
          </button>
        </div>
      );
    } else if (feed == 2) {
      return (
        <div>
          <button className="feedButtons" onClick={() => getAll()}>
            All Tasks
          </button>
          <button className="feedButtons" onClick={() => getUncompleted()}>
            To Do
          </button>
          <button id="selectedFeedButton" onClick={() => getCompleted()}>
            Completed
          </button>
        </div>
      );
    }
  }

  //add a new document to tasks db
  async function addNewDoc(task) {
    // Add a new document in collection "tasks"
    await setDoc(doc(firestore, 'tasks', task.id), {
      id: task.id,
      name: task.name,
      description: task.description,
      completed: task.completed,
    });
  }

  async function readTasksInFromDB() {
    const querySnapshot = await getDocs(collection(firestore, 'tasks'));
    let taskArr = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      //console.log(doc.data().name);
      let taskobject = {
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        completed: doc.data().completed,
      };
      taskArr.push(taskobject);
    });
    setTasks(taskArr);
  }

  useEffect(() => {
    readTasksInFromDB();
  }, []);

  return (
    <div className="containerfluid">
      <Header />
      <div className="row">
        <div className="col-md-6">
          <AddTask onAdd={addTask} saveTask={addNewDoc} />
        </div>
        <div style={{ marginTop: '35px' }} className="col-md-6">
          <center>{feedButtonIndicator()}</center>
          <Tasks
            tasks={tasks}
            uncompleted={uncompleted}
            completed={completed}
            onDelete={completeTask}
            feed={feed}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
