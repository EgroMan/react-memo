import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../EndGameModal/endGame";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { useSelector } from "react-redux";

const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
const STATUS_PREVIEW = "STATUS_PREVIEW";
const STATUS_PAUSED = "STATUS_PAUSED";

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
  const [mistakes, setMistakes] = useState(0);


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
    // Если карта уже открыта или игра окончена, то ничего не делаем
    if (clickedCard.open || isGameEnded) {
      return;
    }
  
    // Открываем выбранную карту
    setCards(cards.map(card => {
      return card.id === clickedCard.id ? { ...card, open: true } : card;
    }));
  
    // Получаем массив только что открытых карт, которые еще не угаданы
    const justOpenedCards = cards.map(card => {
      return card.id === clickedCard.id ? { ...card, open: true } : card;
    }).filter(card => card.open && !card.matched);
    
    // Если была открыта вторая карта и обе они не угаданы, проверяем на совпадение
    if (justOpenedCards.length === 2) {
      const [firstCard, secondCard] = justOpenedCards;
      if (firstCard.suit === secondCard.suit && firstCard.rank === secondCard.rank) {
        // Если карты совпадают, помечаем карты как угаданные
        setCards(cards.map(card => {
          if (card.suit === firstCard.suit && card.rank === firstCard.rank) {
            return { ...card, matched: true, open: true };
          }
          return card;
        }));
  
        // Проверяем, все ли пары карт угаданы
        const allMatched = cards.every(card => card.matched);
        if (allMatched) {
          // Если все пары карт угаданы, игрок победил
          finishGame(STATUS_WON);
        }
      } else {
        // Если карты не совпадают, игрок проиграл
        finishGame(STATUS_LOST);
      }
    }
    // Ожидаем выбора второй карты или начала новой игры
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
    const openCards = []; // массив для хранения открытых карт
  
    // Проверяем каждую пару карт на совпадение валета и масти
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        if (cards[i].rank === cards[j].rank && cards[i].suit === cards[j].suit) {
          openCards.push(cards[i].id, cards[j].id); // сохраняем id открытых карт
        }
      }
    }
  
    // Обновляем состояние карт, открывая только соответствующие карты
    setCards(prevCards =>
      prevCards.map(card => {
        if (openCards.includes(card.id)) {
          return { ...card, open: true };
        }
        return card;
      })
    );
  
    if (status === STATUS_IN_PROGRESS) {
      setGameStatus(STATUS_PAUSED);
  
      setTimeout(() => {
        // Закрываем открытые карты обратно
        setCards(prevCards =>
          prevCards.map(card => {
            if (openCards.includes(card.id)) {
              return { ...card, open: false };
            }
            return card;
          })
        );
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
    const secondCard = closedCards.find(
      card => card.id !== firstCard.id && card.suit === firstCard.suit && card.rank !== firstCard.rank
    );
  
    if (firstCard && secondCard) {
      // Обновляем состояние кард, проверяя, что они не открыты
      setCards(prevCards =>
        prevCards.map(card => {
          if ((card.id === firstCard.id || card.id === secondCard.id) && !card.open) {
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
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS ?
        <div className={styles.superpowers}>
        <button className={styles.prozrenie} onClick={() => handleProzrenie(cards, setCards, setStatus, status, setProzrenieUsed)} disabled={prozrenieUsed}>
          
        </button>
        <button className={styles.alohoma} onClick={() => handleAlohomoa(cards, setCards, setAlohomoaUsed)} disabled={alohomoraUsed}>
          
        </button>
      </div> : null}
      {status === STATUS_IN_PROGRESS ? <Button onClick={resetGame}>Начать заново</Button> : null}
      </div>
      
      <div className={styles.cards}>
  {cards.map(card => (
    <Card
      key={card.id}
      onClick={() => {
        if (card && card.suit && card.id) {
          openCard({ card, open: card.open, id: card.id });
          handleClickOpenNextCard(card);
        }
      }}
      open={status !== STATUS_IN_PROGRESS || (card && card.open)}
      suit={card && card.suit ? card.suit : ''}
      rank={card && card.rank ? card.rank : ''}
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