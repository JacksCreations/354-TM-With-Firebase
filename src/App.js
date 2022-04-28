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
  deleteDoc,
} from '@firebase/firestore';

const App = () => {
  //states used for feed selection, and the different task views
  const [feed, setFeed] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [uncompleted, setUncompleted] = useState(
    tasks.filter((task) => task.completed == false)
  );
  const [completed, setCompleted] = useState(
    tasks.filter((task) => task.completed == true)
  );

  //adds a task to the taskArray
  const addTask = async (task) => {
    setTasks([...tasks, task]);
    setUncompleted([...uncompleted, task]);
  };

  //marks tasks as completed
  const completeTask = (task) => {
    task.completed = true;
    updateToCompleted(task); //UPDATES FIRESTORE DB
    setTasks([...tasks]);
    removeFromTodo();
  };

  //NEXT 3 METHODS ARE FOR DISPLAYING TASK FEEDS
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

  //shows all completed tasks
  function getCompleted() {
    setFeed(2);
    let completed = tasks.filter((task) => task.completed == true);
    setCompleted(completed);
  }

  //removes task from uncompleted state if checked as completed
  function removeFromTodo() {
    let uncompleted = tasks.filter((task) => task.completed === false);

    uncompleted.forEach((task, index) => {
      if (task.completed === true) {
        uncompleted.splice(index, 1);
      }
    });

    setUncompleted(uncompleted);
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

  //FIREBASE FUNCTIONS
  //------------------------------------------------------------//

  //adds a new task to tasks in the firestore DB
  async function addNewDoc(task) {
    // Add a new document in collection "tasks"
    await setDoc(doc(firestore, 'tasks', task.id), {
      id: task.id,
      name: task.name,
      description: task.description,
      completed: task.completed,
    });
  }

  //reads in all tasks from firestore DB and sets taskArr
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

  //updates the firestore DB task completed = true
  async function updateToCompleted(task) {
    const taskRef = doc(firestore, 'tasks', task.id);

    await updateDoc(taskRef, {
      completed: true,
    });
  }

  //clears all task from tasks and database
  function clearTasksFromDB() {
    tasks.forEach(async (task) => {
      await deleteDoc(doc(firestore, 'tasks', task.id));
      setTasks([]);
    });
  }

  //------------------------------------------------------------//

  //calls function to read tasks from DB when loads
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
          <center>
            <button id="clearTasks" onClick={() => clearTasksFromDB()}>
              Clear all Tasks
            </button>
          </center>
        </div>
      </div>
    </div>
  );
};

export default App;
