import React, {Component, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Alert, Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from './AppNavbar';
function StudentEdit() {
    const emptyItem = {
        firstName: '',
        lastName: '',
        checkInTime: ''
    }
    const [item, setItem] = useState(emptyItem);
    const [errorMessage, setErrorMessage] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (id !== 'new') {
                const response = await fetch(`/students/${id}`);
                const data = await response.json();
                setItem({...data, checkInTime: formatToLocalInput(data.checkInTime)});
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setItem((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const formatToLocalInput = (utcDate) => utcDate ? new Date(utcDate).toLocaleString('sv-SE').slice(0, 16) : '';
    const formatToUTC = (localDate) => localDate ? new Date(localDate).toISOString() : null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formattedItem = {
            ...item,
            checkInTime: formatToUTC(item.checkInTime)
        };

        const url = id !== 'new' ? `/students/${id}` : '/students';
        const method = id !== 'new' ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formattedItem)
        });

        if (response.ok) {
            navigate('/'); // Navigate on success
        } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message || 'Request to add student failed');
        }
    };

    const title = <h2>{id !== 'new' ? 'Edit Student' : 'Add Student'}</h2>;

    return (
        <div>
            <AppNavbar/>
            <Container>
                {title}
                {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="firstName">First Name</Label>
                        <Input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={item.firstName || ''}
                            onChange={handleChange}
                            autoComplete="firstName"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="lastName">Last Name</Label>
                        <Input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={item.lastName || ''}
                            onChange={handleChange}
                            autoComplete="lastName"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="checkInTime">Check In Time</Label>
                        <Input
                            type="datetime-local"
                            name="checkInTime"
                            id="checkInTime"
                            value={item.checkInTime || ''}
                            onChange={handleChange}
                            autoComplete="checkInTime"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>
                        <Button color="secondary" tag={Link} to="/">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
}
export default StudentEdit;