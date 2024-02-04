import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div>
        <Container>
        <Row className='p-4 border-bottom'>
            <Col  md={10}>
      <input 
      className='form-control'
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
      />
      </Col>
      <Col>
      <button className='btn btn-dark' onClick={handleSearch}>Search</button>
      </Col>
      </Row>
      </Container>
    </div>
  );
};

export default Search;
