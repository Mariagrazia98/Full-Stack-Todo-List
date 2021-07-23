import { ListGroup } from "react-bootstrap";
import { Link, useParams, useHistory } from "react-router-dom";
import { useEffect } from "react";
import "../css/Filter.css";

const filter = { all: "all", important: "important", today: "today", next7Days: "next7Days", private: "private" };

function MyFilter(props) {
  const { setFilterActive, filterActive, setDirty } = props;
  const history = useHistory();
  const params = useParams();
  
  const validParams = params && params.filter && params.filter in filter;
  const activeFilter = validParams ? params.filter : filter.all;
  

  useEffect(() => {
  if(!validParams){
    history.push("/" + activeFilter);
  }
  }, );

  useEffect(() => {
    setFilterActive(activeFilter);
    setDirty(true);
  }, [activeFilter, setFilterActive]);

 

  return (
    <ListGroup defaultActiveKey={filter.all} variant='flush'>
      <Link
        to={{
          pathname: "/all",
          state: { filterActive: filter.all },
        }}>
        <ListGroup.Item
          id={filter.all}
          action
          className='filter-item'
          active={filterActive === filter.all}
          onClick={() => {
            setFilterActive(filter.all);
          }}>
          All
        </ListGroup.Item>
      </Link>
      <Link
        to={{
          pathname: "/important",
          state: { filterActive: filter.important },
        }}>
        <ListGroup.Item
          id={filter.important}
          action
          className='filter-item'
          active={filterActive === filter.important}
          onClick={() => {
            setFilterActive(filter.important);
          }}>
          Important
        </ListGroup.Item>
      </Link>
      <Link
        to={{
          pathname: "/today",
          state: { filterActive: filter.today },
        }}>
        <ListGroup.Item
          id={filter.today}
          action
          className='filter-item'
          active={filterActive === filter.today}
          onClick={() => {
            setFilterActive(filter.today);
          }}>
          Today
        </ListGroup.Item>
      </Link>
      <Link
        to={{
          pathname: "/next7Days",
          state: { filterActive: filter.next7Days },
        }}>
        <ListGroup.Item
          id={filter.next7Days}
          action
          className='filter-item'
          active={filterActive === filter.next7Days}
          onClick={() => {
            setFilterActive(filter.next7Days);
          }}>
          Next 7 Days
        </ListGroup.Item>
      </Link>
      <Link
        to={{
          pathname: "/private",
          state: { filterActive: filter.private },
        }}>
        <ListGroup.Item
          id={filter.private}
          active={filterActive === filter.private}
          className='filter-item'
          onClick={() => {
            setFilterActive(filter.private);
          }}
          action>
          Private
        </ListGroup.Item>
      </Link>
    </ListGroup>
  );
}

export { MyFilter, filter };
