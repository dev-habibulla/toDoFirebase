import { useEffect, useState } from 'react'
import { getDatabase, ref, set, push, onValue, remove, update } from "firebase/database";
import './App.css'
import firebaseConfig from './config/firebaseConfig.js'

function App() {
 
  const db = getDatabase();

  let [ values, setValues] = useState({
    tName:"",
    tDes:""
  })

  let [taskArr, setTaskArr] = useState([])
  let [id, setId] = useState("")

  let handleChange = (e)=>{


setValues({
  ...values,
  [e.target.name] : e.target.value
})
  }

let handleClick = ()=>{
  set( push(ref(db, 'ToDo')), {
    taskName: values.tName,
    Describtion: values.tDes,
  });
}

let handleDelete = (id)=>{
  remove(ref(db, "ToDo/"+id))
}

let handleEdit = (iteam)=>{
  setValues({
  tName:iteam.taskName,
  tDes:iteam.Describtion
  })
  setId(iteam.id)
}

let handleUpdate = ()=>{

  update(ref(db,"ToDo/"+id),{
    taskName: values.tName,
    Describtion: values.tDes,
  })
}

useEffect(()=>{

  const ToDoRef = ref(db, 'ToDo');
  onValue(ToDoRef, (snapshot) => {
    let arr =[]
  snapshot.forEach(iteam=>{
  
    arr.push({...iteam.val(), id:iteam.key})
  })
  setTaskArr(arr)
});

},[])

  return (
    <>
    
    <input name="tName" onChange={handleChange} placeholder="taskName" value={values.tName}/>
    <input name="tDes" onChange={handleChange} placeholder="taskDescription" value={values.tDes} />
    <button onClick={handleClick}>Submit</button>
    <button onClick={handleUpdate}>Update</button>
   
   <ul>
      {taskArr.map((iteam,index)=>(
         <>
        <li key={index}>{iteam.taskName}------{iteam.Describtion} --{iteam.id}
        <button onClick={()=>handleDelete(iteam.id)}>Delete</button> 
        <button onClick={()=>handleEdit(iteam)}>Edit</button></li>
         </>
      ))
      }
   </ul>

    </>
  )
}

export default App
