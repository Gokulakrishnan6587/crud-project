import { useEffect, useState } from 'react'
import { Button, EditableText, InputGroup, Toaster} from '@blueprintjs/core';
import './App.css'

const appToaster = Toaster.create({
  position:"top"
})

function App() {
  const [users, setUsers] = useState([]);
  const [newName,setNewName] = useState("")
  const [newEmail,setNewEmail] = useState("")
  const [newWebsite,setNewWebsite] = useState("")

//fetching user data from fake api 

  useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((res)=>res.json())
    .then((json)=>setUsers(json))
  },[])

//adding user fn

  function adduser(){
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if(name && email && website){
      fetch('https://jsonplaceholder.typicode.com/users',
         {
          method:"POST",
          body: JSON.stringify({
            name,email,website
          }),
          headers: {
            "Content-Type":"application/json; charset=UTF-8"
          }
         }
    ).then((res)=> res.json())
    .then((json)=>setUsers([...users,json]));
        appToaster.show({
          message:"User Added Successfully",
          intent:"success", 
          timeout: 10000
        })
        setNewName("")
        setNewEmail("")
        setNewWebsite("")
    }
  }

//update user fn

function onchangehandler(id, key,value){
  setUsers((users) =>{
    return users.map(user => {
      return user.id === id ? {...user, [key]: value} : user;
    })
  })
}

///update button code
function updateUser(id){
    const user = users.find((user)=> user.id === id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
         {
          method:"PUT",
          body: JSON.stringify(user),
          headers: {
            "Content-Type":"application/json; charset=UTF-8"
          }
         }
    ).then((res)=> res.json())
    .then((json)=>
        appToaster.show({
          message:"User updated Successfully",
          intent:"success", 
          timeout: 10000
        }))
}

  return (
    <>
        <div className="app">
          <table className='bp4-html-table modifier'>
             <thead>
              <th>ID</th>
              <td>Name</td>
              <td>Email</td>
              <td>Website</td>
              <td>Action</td>
             </thead>
             <tbody>
              {users.map(user=>
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td><EditableText value={user.email} 
                      onChange={value => onchangehandler(user.id, 'email', value)}/></td>
                <td><EditableText value={user.website}
                      onChange={value => onchangehandler(user.id,'website',value)}/></td>
                <td>
                    <Button intent='primary' onClick={() => updateUser(user.id)}>Update</Button>
                    <Button intent='danger'>Delete</Button></td>
              </tr>)}
             </tbody>
             <tfoot>
                <tr>
                  <td></td>
                  <td><InputGroup value={newName}
                      onChange={(e)=> setNewName(e.target.value)} 
                      placeholder='enter name...' /></td>
                  <td><InputGroup value={newEmail}
                      onChange={(e)=> setNewEmail(e.target.value)} 
                      placeholder='enter email...' /></td>
                  <td><InputGroup value={newWebsite}
                      onChange={(e)=> setNewWebsite(e.target.value)} 
                      placeholder='enter Website...' /></td>
                  <td>
                    <Button intent='success' onClick={adduser}>Add User</Button>
                  </td>
                </tr>
             </tfoot>
          </table>
        </div>
    </>
  )
}

export default App
