import Task from "./Task.js";
import { ListGroup, Spinner } from "react-bootstrap";

function TaskList(props) {
  const { tasks, deleteTask, handleEdit, markTask } = props;

  return (
    <>
      {props.loading ? (
        <Spinner animation='border' variant='primary' />
      ) : (
        <ListGroup variant='flush'>
          {tasks.error ? (
            <h4>
              {tasks.error} {JSON.stringify(tasks.details)}
            </h4>
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <Task key={task.id} task={task} deleteTask={deleteTask} handleEdit={handleEdit} markTask={markTask} />
            ))
          ) : (
            <h4>No tasks found</h4>
          )}
        </ListGroup>
      )}
    </>
  );
}
export default TaskList;
