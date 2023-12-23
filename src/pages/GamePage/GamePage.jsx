import { useParams } from "react-router-dom"

import { Cards } from "../../components/Cards/Cards"
import { useState } from "react"

export function GamePage() {
  
  
  const { pairsCount } = useParams()

  return (
    <>
      <Cards pairsCount={parseInt(pairsCount, 10)} previewSeconds={5}></Cards>
    </>
  )
}
