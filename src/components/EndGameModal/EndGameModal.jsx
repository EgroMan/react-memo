import styles from "./EndGameModal.module.css"
import { Button } from "../Button/Button"
import deadImageUrl from "./images/dead.png"
import celebrationImageUrl from "./images/celebration.png"
import { Link } from "react-router-dom"
import { postNewLeader } from "../../api"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
  const dispatch = useDispatch(); // Получаем диспетчер Redux

  useEffect(() => {
    console.log(gameNumber);
  }, []);

  const gameNumber = useSelector(state => state.game.gameNumber);
  const gameDuration = gameDurationMinutes * 60 + gameDurationSeconds;

  const [userName, setUserName] = useState('Пользователь');

  const title = isWon ? (gameNumber === 3 ? "Вы попали на лидерборд" : "Вы победили!") : "Вы проиграли!";
  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;
  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  return (
    <div className={styles.modal}>
      {/* остальной JSX код */}
      <div onClick={()=>{
        if (isWon && gameNumber === 3) {
          dispatch(setGameNumber(yourPayload));
        }
      }}>
        <Button onClick={onClick}>Начать сначала</Button>
      </div>
      <Link
        onClick={() => {
          if (isWon && gameNumber === 3) {
            dispatch(setGameNumber(yourPayload));
          }
        }}
        to="/game/leaderboard">
        Перейти к лидерборду
      </Link>
    </div>
  );
}