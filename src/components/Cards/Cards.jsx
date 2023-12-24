import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { useSelector } from "react-redux";

const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(startDate, endDate) {
  if (!startDate) return { minutes: 0, seconds: 0 };
  if (!endDate) endDate = new Date();
  
  const diffInSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;
  
  return { minutes, seconds };
}





export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const gameLightRegime = useSelector(state => state.game.gameRegime);
  let attemptCounter = undefined;
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const [gameStartDate, setGameStartDate] = useState(null);
  const [gameEndDate, setGameEndDate] = useState(null);
  const [attempts, setAttempts] = useState(2);
  const [prozrenieUsed, setProzrenieUsed] = useState(false);
  const [alohomoraUsed, setAlohomoaUsed] = useState(false);
  const [timer, setTimer] = useState({ seconds: 0, minutes: 0 });
  const isGameEnded = status === STATUS_WON || status === STATUS_LOST;

  function handleClickOpenNextCard(card) {
    if (gameLightRegime && attemptCounter > 0) {
      restartAttempt(card);
    }
  }

  function restartAttempt(card) {
    setCards(cards.map(item => ({
      ...item,
      open: item.id === card.id
    })));
  }

  function finishGame(gameStatus) {
    setGameEndDate(new Date());
    setStatus(gameStatus);
  }

  function startGame() {
    const startDate = new Date();
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }

  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setAttempts(2);
    setProzrenieUsed(false);
    setAlohomoaUsed(false);
    shuffleAndSetCards();
  }

  function shuffleAndSetCards() {
    const shuffledCards = shuffle(generateDeck(pairsCount));
    setCards(shuffledCards);
  }

  function openCard(clickedCard) {
    if (clickedCard.open || status !== STATUS_IN_PROGRESS) return;

    const nextCards = cards.map(card => card.id === clickedCard.id ? { ...card, open: true } : card);
    setCards(nextCards);

    const openCards = nextCards.filter(card => card.open);
    const uniqueOpenCards = getUniqueCards(openCards);

    if (uniqueOpenCards.length === pairsCount * 2) {
      finishGame(STATUS_WON);
      return;
    }

    if (uniqueOpenCards.length % 2 === 0) {
      setAttempts(prev => prev - 1);
      if (attempts === 0) {
        finishGame(STATUS_LOST);
        return;
      }
    }
  }

  function getUniqueCards(cards) {
    return cards.filter(card => {
      return cards.some(compareCard => {
        return compareCard.suit === card.suit && compareCard.rank === card.rank && compareCard.id !== card.id;
      });
    });
  }

  useEffect(() => {
    if (status === STATUS_PREVIEW) {
      shuffleAndSetCards();

      const previewTimer = setTimeout(() => {
        startGame();
      }, previewSeconds * 1000);

      return () => {
        clearTimeout(previewTimer);
      };
    }
  }, [status, pairsCount, previewSeconds]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [gameStartDate, gameEndDate]);

  function handleProzrenie(cards, setCards, setGameStatus, status, setProzrenieUsed) {
    if (setProzrenieUsed()) return;
  
    setProzrenieUsed(true);
    setCards(cards.map(card => ({ ...card, open: true })));
  
    if (status === STATUS_IN_PROGRESS) {
      setGameStatus(STATUS_PAUSED);
  
      setTimeout(() => {
        setCards(cards.map(card => ({ ...card, open: false })));
        setGameStatus(STATUS_IN_PROGRESS);
        setProzrenieUsed(false);
      }, 5000);
    }
  }
  
  function handleAlohomoa(cards, setCards, setAlohomoaUsed) {
    if (setAlohomoaUsed()) return;
  
    setAlohomoaUsed(true);
    const closedCards = cards.filter(card => !card.open);
    const randomIndex = Math.floor(Math.random() * closedCards.length);
    const firstCard = closedCards[randomIndex];
    const secondCard = closedCards.find(card => card.id !== firstCard.id && card.suit === firstCard.suit && card.rank !== firstCard.rank);
  
    if (firstCard && secondCard) {
      setCards(prevCards =>
        prevCards.map(card => {
          if (card.id === firstCard.id || card.id === secondCard.id) {
            return { ...card, open: true };
          }
          return card;
        })
      );
    }
  
    setTimeout(() => setAlohomoaUsed(false), 5000); // Reset alohomoa used after 5 seconds
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{String(timer.minutes).padStart(2, "0")}</div>
              </div>
              <span>:</span>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{String(timer.seconds).padStart(2, "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS ? <Button onClick={resetGame}>Начать заново</Button> : null}
      </div>
      <div className={styles.superpowers}>
        <button onClick={() => handleProzrenie(cards, setCards, setStatus, status, setProzrenieUsed)} disabled={prozrenieUsed}>
          Использовать "Прозрение"
        </button>
        <button onClick={() => handleAlohomoa(cards, setCards, setAlohomoaUsed)} disabled={alohomoraUsed}>
          Использовать "Alohomoa"
        </button>
      </div>
      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => {
              openCard(card);
              handleClickOpenNextCard(card);
            }}
            open={status !== STATUS_IN_PROGRESS || card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>
      {isGameEnded ? (
        <EndGameModal
          isWon={status === STATUS_WON}
          gameDuration={timer}
          onRestart={resetGame}
        />
      ) : null}
      <div className={styles.attempts}>Число попыток: {attempts + 1}</div>
    </div>
  );
}
