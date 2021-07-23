import { Navbar, Form, Button, FormControl } from "react-bootstrap";
import { BsCheckAll, BsFillPersonFill, BsSearch } from "react-icons/bs";
import "../css/Navbar.css";
function MyNavbar(props) {
  return (
    <Navbar id='navbar' expand='md'>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Brand>
        <BsCheckAll /> To do Manager
      </Navbar.Brand>
      {props.loggedIn ? (
        <>
      <Navbar.Collapse id='basic-navbar-nav'>
        <Form inline>
          <FormControl type='text' placeholder='Search' className='mr-sm-2' />
          <Button variant='outline'>
            <BsSearch />
          </Button>
        </Form>
      </Navbar.Collapse>
      <BsFillPersonFill size={30} />
      
        <div>
          {props.user.name}
          <Button variant='outline-dark' className='ml-3' onClick={props.doLogout}>
            Logout
          </Button>
        </div></>
      ) : (
        <></>
      )}
    </Navbar>
  );
}
export default MyNavbar;
