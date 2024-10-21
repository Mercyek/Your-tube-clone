import React from 'react'
import {FaSearch} from "react-icons/fa"
import './Searchlist.css'
const Searchlist = ({Titlearray, setsearchquery}) => {
  return (
    <>
        <div className="Container_Searchlist">
            {Titlearray.map(m=>{
                return <p key={m} onClick={e=>setsearchquery(m)}className='titeItem'>
                    <FaSearch/>{m}
                </p>
            })
            }
        </div>
    </>
  )
}

export default Searchlist
