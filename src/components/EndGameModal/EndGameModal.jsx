import styles from "./EndGameModal.module.css";
import { Button } from "../Button/Button";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { Link } from "react-router-dom";
import { postNewLeader } from "../../api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
  const gameNumber = useSelector(state => state.game.gameNumber);
  const gameDuration = gameDurationMinutes * 60 + gameDurationSeconds;
  const [userName, setUserName] = useState('Пользователь');

  useEffect(() => {
    if (gameNumber !== undefined) {
      console.log(gameNumber);
    }
  }, [gameNumber]);

  const title = isWon ? (gameNumber === 3 ? "Вы попали в наши лидеры" : "Вы победили!") : "Вы проиграли!";
  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;
  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  const handleLeaderboardClick = () => {
    if (isWon && gameNumber === 3) {
      postNewLeader(userName, gameDuration);
    }
  };

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {(isWon && gameNumber === 3) && (
        <input
          onChange={(event) => {
            setUserName(event.target.value);
          }}
          className={styles.input}
          type="text"
          placeholder="Введите ваше имя"
        />
      )}
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
  {gameDurationMinutes && gameDurationSeconds && gameDurationMinutes.toString().padStart(2, "0")}.{gameDurationSeconds.toString().padStart(2, "0")}
</div>
      <div>
        <Button onClick={onClick}>Начать сначала</Button>
      </div>
      <div>
        {(isWon && gameNumber === 3) && (
          <Button onClick={handleLeaderboardClick}>Перейти к нашим лидерам</Button>
        )}
        {!isWon && (
          <Link to="/game/leaderboard">Перейти к нашим лидерам</Link>
        )}
      </div>
    </div>
  );
}
