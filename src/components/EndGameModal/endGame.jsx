import styles from "./EndGameModal.module.css"
import { Button } from "../Button/Button"
import deadImageUrl from "./images/dead.png"
import celebrationImageUrl from "./images/celebration.png"
import { Link } from "react-router-dom"
import { postNewLeader } from "../../api"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"



export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
  
const gameNumber= useSelector(state=>state.game.gameNumber) 
const gameDuration = gameDurationMinutes*60+gameDurationSeconds 

const gameHardRegime= useSelector(state=>state.game.gameRegime) 
const handleAlohomoa = useSelector(state=>state.game.handleAlohomoa)
const handleProzrenie = useSelector(state=>state.game.handleProzrenie)
  
  const[userName,setUserName]=useState('Пользователь')
  
  const title = isWon ? (gameNumber===3?"Вы попали на лидерборд":"Вы победили!") : "Вы проиграли!"
  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl
  const imgAlt = isWon ? "celebration emodji" : "dead emodji"

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {(isWon===true) 
      ?<input onChange={(event)=>{setUserName(event.target.value)
        

        }} className={styles.input} type="text" placeholder= "Пользователь"></input>:null}
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart(2, "0")}.{gameDurationSeconds.toString().padStart(2, "0")}
      </div>
<div onClick={(isWon===true)
   ?()=>postNewLeader(userName,gameDuration,handleAlohomoa,handleProzrenie, gameHardRegime):null}>
      
      <Button onClick={onClick}>Начать сначала</Button>
     

</div>
      <Link className={styles.text} onClick={(isWon===true)
 
         ? ()=>postNewLeader(userName,gameDuration,handleAlohomoa,handleProzrenie, gameHardRegime):null} to="/game/leaderboard" > Перейти к лидерборду </Link>
    </div>
  )
}