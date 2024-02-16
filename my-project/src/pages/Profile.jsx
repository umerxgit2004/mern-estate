import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useRef, useState, useEffect } from "react";
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice.js";


function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is" + progress +" % done")
        setFilePerc(Math.round(progress));
      },
      (error) => {
        
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((DownloadURL) => {
          setFormData({ ...formData, avatar: DownloadURL });
        });
      }
    );
  };
console.log(formData)
const handleChange = (e) =>{
  setFormData({...formData,[e.target.id]:e.target.value}) 
}
const handleSubmit = async (e) =>{
  e.preventDefault()//prevent refreshing of page
  try{
    dispatch(updateUserStart())
    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method:'POST',
      headers:{
          'Content-Type':'application/json',
      },
      body:JSON.stringify(formData)
    })
    const data = await res.json()
    if(data.success === false){
      dispatch(updateUserFailure(data.message))
      return
    }
    dispatch(updateUserSuccess(data))
    setUpdateSuccess(true);
    
  } catch (error){
    //want to dispatch error add 3 more reducers in userSlice for our update user
    dispatch(updateUserFailure(error.message))
  }
}
console.log(currentUser._id)
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
        <img onClick={() => fileRef.current.click()} src={formData.avatar||currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input  onChange={handleChange} defaultValue={currentUser.username} type="text" placeholder="username" className="border p-3 rounded-lg" id="username" />
        <input  onChange={handleChange} defaultValue={currentUser.email} type="text" placeholder="email" className="border p-3 rounded-lg" id="email" />
        <input  onChange={handleChange} type="text" placeholder="password" className="border p-3 rounded-lg" id="password" />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}

export default Profile;
