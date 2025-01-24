import React, {Component, useEffect, useState} from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import AppNavbar from "./AppNavbar";

function StudentList() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
                const response = await fetch(`/students`);
                const data = await response.json();
                setStudents(data);
                setIsLoading(false);
            }
        fetchData();
    }, []);

    const remove = async (id) => {
         const response = await fetch(`/students/${id}`, {
             method: 'DELETE',
             headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json'
             }
         });

         if (response.ok) { // Check if the delete request was successful
             const updatedStudents = students.filter(student => student.id !== id);
             setStudents(updatedStudents);
         }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }
    const studentList = students.map(student => (
        <tr key={student.id}>
            <td style={{ whiteSpace: 'nowrap' }}>{student.firstName}</td>
            <td>{student.lastName}</td>
            <td>{student.checkInTime}</td>
            <td>
                <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link} to={`/students/${student.id}`}>Edit</Button>
                    <Button size="sm" color="danger" onClick={() => remove(student.id)}>Delete</Button>
                </ButtonGroup>
            </td>
        </tr>
    ));
    return (
        <div>
            <AppNavbar />
            <Container fluid>
                <h3>Students</h3>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th width="25%">First Name</th>
                        <th width="25%">Last Name</th>
                        <th width="25%">Checked In Time</th>
                        <th width="25%">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {studentList}
                    </tbody>
                </Table>
                <div className="float-right">
                    <Button color="success" tag={Link} to="/students/new">Add Student</Button>
                </div>
            </Container>
        </div>
    );
}
export default StudentList;