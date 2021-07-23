import { ListGroup, Form, ButtonGroup, Button, Container, Col, Row } from "react-bootstrap";
import { BsFillEyeFill, BsPencil, BsFillTrashFill } from "react-icons/bs";
import "../css/Task.css";
import dayjs from "dayjs";

function Task(props) {
  const { task, handleEdit, deleteTask, markTask } = props;

  let statusClass = null;
  switch(task.status) {
    case 'added':
      statusClass = 'success';
      break;
    case 'deleted':
      statusClass = 'danger';
      break;
    case 'updated':
      statusClass = 'warning';
      break;
    default:
      break;
  }


  return (
    <ListGroup.Item variant={statusClass}>
      <Container>
        <Row id='task-row'>
          <Col md={6}>
            <Form.Group className={"mb-0"} controlId={task.description}>
              <Form.Check
                inline
                type='checkbox'
                label={task.description}
                custom
                checked={task.completed === 1 ? true : false}
                onChange={(event) => (task.completed === 1 ? markTask(task.id, 0) : markTask(task.id, 1))}
                className={`${task.important ? "text-danger" : ""}`}
              />
            </Form.Group>
          </Col>
          <Col className='text-right'>{task.priv ? <BsFillEyeFill /> : ""}</Col>
          <Col className='text-right'>
            <div>{task.deadline ? dayjs(task.deadline).format("DD/MM/YYYY") : ""}</div>
          </Col>
          <Col className='text-right'>
            <ButtonGroup>
              <Button
                variant='outline-primary'
                onClick={() => {
                  handleEdit(task);
                }}>
                <BsPencil />
              </Button>
              <Button
                variant='outline-danger'
                onClick={() => {
                  deleteTask(task.id);
                }}>
                <BsFillTrashFill />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </ListGroup.Item>
  );
}
export default Task;
