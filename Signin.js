import { useNavigate } from 'react-router-dom';
import './Signin.css';
import { useEffect, useState } from 'react';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signin(){
    const navigate = useNavigate();
    const [user,setUser]=useState('')
    const [pass,setPass]=useState('')

    useEffect(()=>{
        if(localStorage.getItem('token') == null){
            
        }
        else{
            navigate('/dash')
        }
    })
    const onLogin= async(e)=>{
        e.preventDefault();
        if(user ==='' || pass===''){
            toast.error('All fields are required !!')
        }
        else{
            const res = await fetch('http://localhost:8000/api/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    user:user,
                    pass:pass
                })
            })
            const data = await res.json();
            if(!data.status){
                toast.error(data.message)
            }
            else{
                if(data.message==='Login Successful !!'){
                    toast.success(data.message)
                    setTimeout(()=>{
                        localStorage.setItem('token',user)
                        navigate('/dash')
                    },2100)
                }
                else{
                    toast.error(data.message)
                    setTimeout(()=>{
                        setUser('')
                        setPass('')
                    },2100)
                }
            }
        }
    }

    return(
        <>
            <div className='login'>
                <div className='card1'>
                    <div className='title'>
                        <h2>Sign In</h2>
                    </div>
                    <form onSubmit={onLogin}>
                    <div className='input-field'>
                        <input type='email' placeholder='username' value={user} onChange={(e)=>setUser(e.target.value)}></input>
                    </div>
                    <div className='input-field'>
                        <input type='password' placeholder='password' value={pass} onChange={(e)=>setPass(e.target.value)}></input>
                    </div> 
                    <input type='submit' value='Login'></input>
                </form>
                </div>
            </div>
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
        </>
    )
}
export default Signin;