import { Modal, Button, Form, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "../css/Form.css";

function MyForm(props) {
  const { taskToEdit, setTaskToEdit, addTask, editTask, show, onHide, task } = props;
  const [validated, setValidated] = useState(false);
  const [description, setDescription] = useState("");
  const [important, setImportant] = useState(0);
  const [priv, setPriv] = useState(0);
  const [deadline, setDeadline] = useState();
  const [id, setId] = useState(task.length);

  useEffect(() => {
    if (show === false) {
      setDescription("");
      setImportant(0);
      setPriv(0);
      setDeadline();
      setTaskToEdit(null);
    } else if (show === true && taskToEdit) {
      setDescription(taskToEdit.description);
      setImportant(taskToEdit.important ? 1 : 0);
      setPriv(taskToEdit.priv ? 1 : 0);
      setDeadline(taskToEdit.deadline);
      setId(taskToEdit.id);
    }
  }, [show, taskToEdit, setTaskToEdit]);

  const handleDateChange = (event) => {
    setDeadline(dayjs(event.target.value));
  };

  const handleClose = () => {
    setValidated(false);
    onHide();
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      if (taskToEdit) {
        const updateTask = {
          id: taskToEdit.id,
          description: description,
          important: important,
          private: priv,
          completed: 0,
          user: 1,
        };
        if (deadline && dayjs(deadline).isValid()) {
          updateTask.deadline = dayjs(deadline).format("YYYY-MM-DD HH:mm");
        }
        editTask(updateTask);
      } else {
        const newTask = {
          id: id + 1,
          description: description,
          important: important,
          private: priv,
          completed: 0,
          user: 1,
        };
        setId((id) => id + 1);
        if (deadline && dayjs(deadline).isValid()) {
          newTask.deadline = dayjs(deadline).format("YYYY-MM-DD HH:mm");
        }
        addTask(newTask);
      }
      handleClose();
    } else {
      setValidated(true);
    }
  };

  return (
    <Modal size='lg' aria-labelledby='contained-modal-title-vcenter' centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'> {taskToEdit ? "Update a task" : "Add new task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} id='addTask' onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId='description'>
              <Form.Label>Description* </Form.Label>
              <Form.Control
                required
                type='text'
                maxLength={50}
                value={description || ""}
                placeholder={"Write something.."}
                onChange={(event) => setDescription(event.target.value)}
              />
              <Form.Control.Feedback type='invalid'>Please insert a description.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} controlId='selectedDate'>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type='date'
                min={!taskToEdit ? dayjs().format("YYYY-MM-DD") : ""}
                value={deadline ? dayjs(deadline).format("YYYY-MM-DD") : ""}
                onChange={handleDateChange}
              />
            </Form.Group>
          </Form.Row>
          <Form.Check
            label='Private'
            name='privateCheckbox'
            type='checkbox'
            id='privateCheckbox'
            checked={priv}
            custom
            onChange={(event) => (priv ? setPriv(0) : setPriv(1))}
          />

          <Form.Check
            label='Important'
            name='importantCheckbox'
            type='checkbox'
            id='importantCheckbox'
            checked={important}
            custom
            onChange={(event) => (important ? setImportant(0) : setImportant(1))}
          />
          <div id='requiredField'>* required field</div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type='submit' form='addTask' md='auto'>
          {taskToEdit ? "Save" : "Add"}
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MyForm;
