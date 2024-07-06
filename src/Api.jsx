import React, { useEffect, useState } from 'react'
import { Button, InputGroup, EditableText, Toaster } from '@blueprintjs/core'
import './App.css'

const appToaster = Toaster.create({
    position: "top"
})

function Api() {

    const [users, setUsers] = useState([])
    const [newName, setNewName] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [newWebsite, setNewWebsite] = useState("")

    // Fetching data from web API
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((res) => res.json())
            .then((json) => setUsers(json))
    }, [])

    // Add user function
    function addUser() {
        const name = newName.trim();
        const email = newEmail.trim();
        const website = newWebsite.trim();

        if (name && email && website) {
            fetch('https://jsonplaceholder.typicode.com/users', {
                method: "POST",
                body: JSON.stringify({ name, email, website }),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            })
                .then((res) => res.json())
                .then((json) => setUsers([...users, json]));
            appToaster.show({
                message: "User Added successfully",
                intent: "success",
                timeout: 5000
            })
            setNewName("")
            setNewEmail("")
            setNewWebsite("")
        } else {
            appToaster.show({
                message: "Please fill all fields",
                intent: "warning",
                timeout: 5000
            })
        }
    }

    // Update user function
    function onChangeHandler(id, key, value) {
        setUsers((users) => {
            return users.map(user => {
                return user.id === id ? { ...user, [key]: value } : user;
            })
        })
    }

    // Update user button
    function updateUser(id) {
        const user = users.find((user) => user.id === id);
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }).then((res) => res.json())
            .then((json) =>
                appToaster.show({
                    message: "User Updated successfully",
                    intent: "warning",
                    timeout: 5000
                })
            )
    }

    //delete user
    function deleteUser(id){
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
        {
            method: 'DELETE'
        }).then((res) => res.json())
        .then((json) => {
            setUsers((users)=>{
                return users.filter(user => user.id !== id)
            })
            appToaster.show({
                message: "User Deleted successfully",
                intent: "danger",
                timeout: 5000
            })
    })
}

    return (
        <>
            <div className='app'>
                <h1>Crud using fake API</h1>
                <table className='bp4-html-table modifier'>
                    <thead>
                        <tr>
                            <td>Id</td>
                            <td>Name</td>
                            <td>Email</td>
                            <td>Website</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user =>
                            <tr key={user.id}>
                                <td data-label="Id">{user.id}</td>
                                <td data-label="Name">{user.name}</td>
                                <td data-label="Email"><EditableText value={user.email}
                                    onChange={value => onChangeHandler(user.id, 'email', value)} /></td>
                                <td data-label="Website"><EditableText value={user.website}
                                    onChange={value => onChangeHandler(user.id, 'website', value)} /></td>
                                <td data-label="Action" className="action-buttons">
                                    <Button intent='warning' onClick={() => updateUser(user.id)}>Update</Button>
                                    &nbsp;
                                    <Button intent='danger' onClick={()=> deleteUser(user.id)}>Delete</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td><InputGroup value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder='Enter the name...' /></td>
                            <td><InputGroup value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder='Enter the email id...' /></td>
                            <td><InputGroup value={newWebsite}
                                onChange={(e) => setNewWebsite(e.target.value)}
                                placeholder='Enter your website...' /></td>
                            <td>
                                <Button intent='success' onClick={addUser}>Add user</Button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}

export default Api
