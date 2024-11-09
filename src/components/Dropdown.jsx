import { DotsThree, PencilSimple, Trash } from '@phosphor-icons/react'
import React, { useState,useRef, useEffect } from 'react'

export default function Dropdown() {
  const [dropdownOpen,setDropdownOpen]=useState(false)
  
  const trigger = useRef(null)
  const dropdown = useRef(null)

  //we click outside dropdown should be closed
  useEffect(()=>{
    const clickHandler = ({target})=>{
     // refs are not null
          if(!dropdown.current) return;
// Check if click is outside dropdown and trigger elements
          if(!dropdown || dropdown.current.contains(target) || trigger.current.contains(target)){
            return;
          }

          //the above 2 conditions fails the dropdown clicked outside.so dropdown closed

          setDropdownOpen(false)

    }

    document.addEventListener("click",clickHandler);

    return ()=> document.removeEventListener("click",clickHandler)
  },[])

  //press escape button dropdown should be closed
  useEffect(()=>{
    const keyHandler = ({keyCode})=>{
      if(!dropdown || keyCode !== 27) return;

      setDropdownOpen(false)
    }
    document.addEventListener("keydown",keyHandler)

    return () => document.removeEventListener("keydown",keyHandler)
  },[])

  return (
    <div className='relative flex'>
      <button
      className='text-[#98A6AD] hover:text-body'
      ref={trigger}
      onClick={()=>setDropdownOpen((prev)=>!prev)}
      >
       <DotsThree size={24}/>
      </button>

      <div ref={dropdown} onFocus={()=>setDropdownOpen(true)} onBlur={()=> setDropdownOpen(false)}  className={`absolute right-0 top-full z-40 w-40 space-y-1 rounded-sm border border-stroke bg-white p-1.5 shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? "block" : "hidden"}`}>

      <button className='flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4'>
        <PencilSimple size={24}/>
        Edit
      </button>

      <button className='flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4'>
         <Trash size={24}/>
         Delete
      </button>
    </div>
    </div>
  )
}
