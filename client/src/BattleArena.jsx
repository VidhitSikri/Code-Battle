import React from 'react'
import { useParams } from 'react-router-dom'
const BattleArena = () => {

  const { roomcode } = useParams()
  console.log('roomcode:', roomcode)
  return (
    <div>
      
      <h1>Battle Arena: {roomcode}</h1>
    </div>
  )
}

export default BattleArena
