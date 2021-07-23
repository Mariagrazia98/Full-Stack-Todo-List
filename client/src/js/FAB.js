import { BsPlus } from "react-icons/bs";
import { Button } from "react-bootstrap";
import "../css/FAB.css";
function MyFAB(props) {
  const { setModalShow } = props;
  return (
    <Button id='fab' onClick={() => setModalShow(true)}>
      <BsPlus size={25} />
    </Button>
  );
}
export default MyFAB;
