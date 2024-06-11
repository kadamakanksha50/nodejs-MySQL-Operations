import { useEffect, useState } from 'react';
import './Dash.css';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate } from 'react-router-dom';

function Dash() {

  const [popup,setPopUp]=useState(false)
  const [fullName,setFullName]=useState('')
  const [emailID,setEmailID]=useState('')
  const [contact,setContact]=useState('')
  const [city,setCity]=useState('')
  const [gender,setGender]=useState('')
  const [userData,setUserData]=useState([])
  const [SrNo,setSrNo]=useState(0)
  const [action,setAction]=useState('Add Details')
  const navigate=useNavigate();

  const notify = (msg)=>toast(msg);

  useEffect(()=>{
    if(localStorage.getItem('token')==null){
        navigate('/')
    }
  })

  useEffect(()=>{
    fetchUsers()
  },[])

  const fetchUsers = async()=>{
    const res = await fetch('http://localhost:8000/api/user')
    const data = await res.json()
    setUserData(data.message)
  }

  const editUser=(index,srno)=>{
    setSrNo(srno)
    setFullName(userData[index].FullName)
    setEmailID(userData[index].EmailID)
    setContact(userData[index].Contact)
    setCity(userData[index].City)
    setGender(userData[index].Gender)
    setPopUp(popup=>!popup)
    setAction('Edit Details')
  }

  const deleteUser= async (srno)=>{
    setSrNo(srno)
    const res = await fetch(`http://localhost:8000/api/delete/${SrNo}`,{
      method:'DELETE'
    })
    const data = await res.json()
    if(data.status){
      notify(data.message)
      fetchUsers()
    }
    else{
      notify('Something went wrong !!')
    }
  }

  const toggle=()=>{
    setPopUp(popup=>!popup)
    setAction('Add Details')
    setFullName('')
    setEmailID('')
    setContact('')
    setCity('')
    setGender('SELECT')
  }
  const onDataSubmit=async(e)=>{
    e.preventDefault()
    if(action==='Add Details'){
        const res = await fetch(`http://localhost:8000/api/validationEmail/${emailID}`)
        const data = await res.json()
        if(!data.status){
            toast.error(data.message)
        }else{
            if(data.message=='new'){
                const res = await fetch('http://localhost:8000/api/insert',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        fullName:fullName,
                        emailID:emailID,
                        contact:contact,
                        city:city,
                        gender:gender
                    })
                })
                const data = await res.json();
                if(data.status){
                    toast.success(data.message)
                    setFullName('')
                    setEmailID('')
                    setContact('')
                    setCity('')
                    setGender('')
                    setTimeout(()=>{
                        toggle()
                        fetchUsers()
                    },2000);
                }
                else{
                    toast.error('Something went wrong !!')
                }
            }else{
                toast.error('Email is already exists !!')
                setEmailID('')
            }
        }
    }
    else if(action==='Edit Details'){
      const res = await fetch(`http://localhost:8000/api/update/${SrNo}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          fullName:fullName,
          emailID:emailID,
          contact:contact,
          city:city,
          gender:gender
        })
      })
      const data = await res.json();
      if(data.status){
        notify(data.message)
        setFullName('')
        setEmailID('')
        setContact('')
        setCity('')
        setGender('')
        setTimeout(()=>{
          toggle()
          fetchUsers()
        },2000);
      }
      else{
        notify('Something went wrong !!')
      }
    }
  }

  return (
    <div>
      <div className='head'>
        <h2>NodeJS MySQL Application</h2>
        <button onClick={toggle}>Add Details</button>
      </div>
      {
        popup &&
        <div className='card'>
        <div className='title'>
          <h3>{action}</h3>
          <label onClick={toggle}>X</label>
        </div>
        <form onSubmit={onDataSubmit}>
          <div className='input-field'>
            <label>Full Name<span>*</span></label>
            <input type='text' value={fullName} onChange={(e)=>setFullName(e.target.value)}></input>
          </div>
          <div className='input-field'>
            <label>Email ID<span>*</span></label>
            <input type='email' value={emailID} onChange={(e)=>setEmailID(e.target.value)}></input>
          </div>
          <div className='input-field'>
            <label>Contact<span>*</span></label>
            <input type='number' value={contact} onChange={(e)=>setContact(e.target.value)}></input>
          </div>
          <div className='input-field'>
            <label>City<span>*</span></label>
            <input type='text' value={city} onChange={(e)=>setCity(e.target.value)}></input>
          </div>
          <div className='input-field'>
            <label>Gender<span>*</span></label>
            <select value={gender} onChange={(e)=>setGender(e.target.value)}>
              <option selected value=''>SELECT</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='other'>Other</option>
            </select>
          </div>
          <input type='submit' value={action}></input>
        </form>
      </div>
      }
      <table>
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Full Name</th>
            <th>Email ID</th>
            <th>Contact</th>
            <th>City</th>
            <th>Gender</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            userData.map((item,index)=>(
              <tr key={item.SrNo}>
                <td>{item.SrNo}</td>
                <td>{item.FullName}</td>                
                <td>{item.EmailID}</td>
                <td>{item.Contact}</td>
                <td>{item.City}</td>
                <td>{item.Gender}</td>
                <td className='actions'>
                  <button onClick={()=>editUser(index,item.SrNo)}><i className="fa-solid fa-user-pen"></i></button>
                  <button onClick={()=>deleteUser(item.SrNo)}><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <ToastContainer
        position='top-center'
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      ></ToastContainer>
    </div>
  );
}

export default Dash;