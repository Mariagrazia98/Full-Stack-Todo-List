import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "./js/Navbar.js";
import { MyFilter, filter } from "./js/Filter.js";
import TaskList from "./js/TaskList.js";
import MyFAB from "./js/FAB.js";
import MyForm from "./js/TaskForm.js";
import MyLoginForm from "./js/LoginForm.js";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isBetween from "dayjs/plugin/isBetween";
import API from "./API";

dayjs.extend(isToday);
dayjs.extend(isBetween);

function AlertBox(props) {
  const { alert, setAlert, message } = props;
  if (alert) {
    return (
      <Alert className='mt-3 pb-0' variant={message.type} onClose={() => setAlert(false)} dismissible>
        {message.type === "success" ? <></> : <Alert.Heading>Oh snap! You got an error!</Alert.Heading>}
        <p>{message.msg}</p>
      </Alert>
    );
  } else {
    return <> </>;
  }
}

function App() {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filterActive, setFilterActive] = useState(filter.all);
  const [modalShow, setModalShow] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(true);
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        
        setUser(user);
        setLoggedIn(true);
        setLoading(false);
      } catch (err) {
        console.error(err.error);
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const getTask = async () => {
      if (loggedIn) {
        const tasks = await API.getAllTasks();
        setTasks(tasks);
      }
    };
    getTask().catch((err) => {
      setMessage({ msg: `Impossible to load your Tasks! Please, try again later...`, type: "danger" });
      console.error(err);
    });
  }, [loggedIn]);

  useEffect(() => {
    if (message !== "") {
      setAlert(true);
    }
  }, [message]);

  useEffect(() => {
    const getTasks = async () => {
      let tasksList = [];
      switch (filterActive) {
        case filter.all:
          tasksList = await API.getFilteredTask("all");
          break;

        case filter.important:
          tasksList = await API.getFilteredTask("important");
          break;

        case filter.private:
          tasksList = await API.getFilteredTask("private");
          break;
        case filter.next7Days:
          tasksList = await API.getFilteredTask("next7days");
          break;

        case filter.today:
          tasksList = await API.getFilteredDeadlineTask(dayjs().format("YYYY-MM-DD").toString());
          break;
        default:
          break;
      }
      setTasks(tasksList);
    };

    if ((tasks.length || dirty) && loggedIn) {
      getTasks()
        .then(() => {
          setLoading(false);
          setDirty(false);
        })
        .catch((err) => {
          setMessage({ msg: `Impossible to load your Tasks! Please, try again later...`, type: "danger" });
          console.error(err);
        });
    }
  }, [tasks.length, filterActive, dirty]);

  const doLogin = async (credentials) => {
    try {
      const user = await API.login(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.name}!`, type: "success" });
      setUser(user);
    } catch (err) {
      console.log(err);
      setMessage({ msg: err.error, type: "danger" });
    }
  };

  const doLogout = async () => {
    try {
      await API.logout();
      setLoggedIn(false);
      setAlert(false);
      setUser("");
      setTasks([]);
    } catch (err) {
      setMessage({ msg: err, type: "danger" });
    }
  };

  const deleteTask = (id) => {
    setTasks((oldTask) => {
      return oldTask.map((tks) => {
        if (tks.id === id) return { ...tks, status: "deleted" };
        else return tks;
      });
    });

    API.deleteTask(id)
      .then(() => {
        setDirty(true);
      })
      .catch((err) => setMessage((err) => handleErrors(err)));
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setModalShow(true);
  };

  const editTask = (task) => {
    task.status = "updated";
    setTasks((oldTasks) => {
      return oldTasks.map((tsk) => {
        if (tsk.id === task.id)
          return {
            id: task.id,
            description: task.description,
            important: task.important,
            priv: task.priv,
            deadline: task.deadline,
          };
        else return tsk;
      });
    });
    API.editTask(task)
      .then(() => {
        setDirty(true);
      })
      .catch((err) => setMessage((err) => handleErrors(err)));
  };

  const handleErrors = (err) => {
    if (err.errors) setMessage({ msg: err.errors[0].msg + ": " + err.errors[0].param, type: "danger" });
    else setMessage({ msg: err.error, type: "danger" });

    setDirty(true);
  };

  const addTask = (task) => {
    task.status = "added";
    setTasks((tasks) => [...tasks, task]);
    const createTask = async () => {
      API.addNewTask(task)
        .then(() => {
          setDirty(true);
        })
        .catch((err) => handleErrors(err));
    };
    createTask();
  };

  const markTask = (taskID, isCompleted) => {
    setTasks((oldTasks) => {
      return oldTasks.map((task) => {
        if (task.id === taskID)
          return {
            id: task.id,
            description: task.description,
            important: task.important,
            priv: task.priv,
            deadline: task.deadline,
            completed: isCompleted,
          };
        else return task;
      });
    });
    API.markTask(taskID, isCompleted)
      .then(() => {
        setDirty(true);
      })
      .catch((err) => handleErrors(err));
  };

  return (
    <Router>
      <MyNavbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} user={user} doLogout={doLogout} />
      <Container id='main-container' fluid>
        <AlertBox alert={alert} setAlert={setAlert} message={message} setMessage={setMessage} />
        <Row id='main-row'>
          <Switch>
            <Route
              path='/login'
              render={() => (
                <>
                  {loggedIn ? (
                    <Redirect to='/all' />
                  ) : (
                    <MyLoginForm login={doLogin} message={message} setMessage={setMessage} />
                  )}
                </>
              )}
            />
            <Route exact path={["/:filter"]}>
              {loggedIn ? (
                <>
                  <Col className='collapse d-md-block p-0' md='4'>
                    <MyFilter setFilterActive={setFilterActive} filterActive={filterActive} setDirty={setDirty} />
                  </Col>
                  <Col md={8} className={loading ? "d-flex justify-content-center align-items-center" : ""}>
                    {loading ? "" : <h2 className='filter-title'> {filterActive.toUpperCase()} </h2>}
                    <TaskList
                      loading={loading}
                      tasks={tasks}
                      deleteTask={deleteTask}
                      handleEdit={handleEdit}
                      setFilterActive={setFilterActive}
                      setDirty={setDirty}
                      filter={filter.all}
                      markTask={markTask}></TaskList>
                  </Col>
                </>
              ) : loading ? (
                <div className={loading ? "m-auto" : ""}>
                <Spinner animation='border' variant='primary' />
                </div>
              ) : (
                <Redirect to='/login' />
              )}
            </Route>
            <Redirect to='/all' />
          </Switch>
        </Row>
      </Container>
      {loggedIn ? (
        <>
          <MyFAB setModalShow={setModalShow} />
          <MyForm
            show={modalShow}
            onHide={() => setModalShow(false)}
            task={tasks}
            taskToEdit={taskToEdit}
            addTask={addTask}
            editTask={editTask}
            setTaskToEdit={setTaskToEdit}
          />
        </>
      ) : (
        <> </>
      )}
    </Router>
  );
}

export default App;
