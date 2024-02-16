import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {  useDispatch, useSelector } from "react-redux"
import { signInStart,signInSuccess, signInFailure } from "../redux/user/userSlice.js"
import OAuth from "../components/OAuth.jsx"


function SignIn() {
  const [formData, setFormData] = useState({})
  // const [error,setError] = useState(null)
  // const [loading, setLoading] = useState(false)
  const {loading, error} = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    })
  }
  const handleSubmit = async (e) =>{
    e.preventDefault()
    
  try{
      // setLoading(true)
      dispatch(signInStart())
      console.log("started sign in")
      const res = await fetch('/api/auth/signin',
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData)//send body 
      })
      const data = await res.json()
      if(data.success === false){
        dispatch(signInFailure(data.message))
        console.log("sign in failure")
        return
      }
      // setLoading(false)//loading is completed
      // setError(null)
      console.log("sign in successful")
      dispatch(signInSuccess(data))
      navigate('/')
      
    }catch(error){
      dispatch(signInFailure(error.message))
    }
  
    
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl text-center font-semibold my-7 '>Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      
        <input type="text" placeholder='email' className='border p-3 rounded-lg' id="email" onChange={handleChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id="password" onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer h-12 ">
          {loading?'Loading...':'Sign In'}
        </button>
          <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont Have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-500">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500">{error.message}</p>}

    </div>
  )
}

export default SignIn