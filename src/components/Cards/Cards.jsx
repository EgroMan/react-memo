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
  const [prozrenieUsed, setProzrenieUsed] = useState(false);
  const [alohomoraUsed, setAlohomoaUsed] = useState(false);
  const easyMode = useSelector(state => state.game.easyMode);
  const attempts = easyMode ? 3 : 1 + 2;
  const [remainingAttempts, setRemainingAttempts] = useState(attempts);
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const [gameStartDate, setGameStartDate] = useState(null);
  const [gameEndDate, setGameEndDate] = useState(null);
  const [showLeaderboardPrompt, setShowLeaderboardPrompt] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);

  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
    if (status === STATUS_WON && pairsCount === 9) {
      setShowLeaderboardPrompt(true);
    }
  }
  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }
  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setRemainingAttempts(easyMode ? 3 : 1);
  }

  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    const playerLost = openCardsWithoutPair.length >= 2;

    // "Игрок проиграл", т.к на поле есть две открытые карты без пары
    if (playerLost) {
      if (!easyMode) {
        // В стандартном режиме завершаем игру после одной ошибки
        setRemainingAttempts(prevAttempts => prevAttempts - 1);
        if (remainingAttempts <= 1) {
          // Завершаем игру после использования всех попыток
          finishGame(STATUS_LOST);
        } else {
          // Открываем и закрываем вторую карту после ошибки
          const updatedCards = nextCards.map(card => {
            if (openCardsWithoutPair.some(openCard => openCard.id === card.id)) {
              // Временно открываем вторую карту
              if (card.open) {
                setTimeout(() => {
                  setCards(prevCards => {
                    const updated = prevCards.map(c => (c.id === card.id ? { ...c, open: false } : c));
                    return updated;
                  });
                }, 1000);
              }
            }
            return card;
          });
          setCards(updatedCards);
        }
      } else {
        // В облегченном режиме уменьшаем счетчик ошибок
        setRemainingAttempts(prevAttempts => prevAttempts - 1);

        if (remainingAttempts <= 1) {
          // Завершаем игру после использования всех попыток
          finishGame(STATUS_LOST);
        } else {
          // Открываем и закрываем вторую карту после ошибки
          const updatedCards = nextCards.map(card => {
            if (openCardsWithoutPair.some(openCard => openCard.id === card.id)) {
              // Временно открываем вторую карту
              if (card.open) {
                setTimeout(() => {
                  setCards(prevCards => {
                    const updated = prevCards.map(c => (c.id === card.id ? { ...c, open: false } : c));
                    return updated;
                  });
                }, 1000); // Задержка в миллисекундах (в данном случае 1 секунда)
              }
            }
            return card;
          });
          setCards(updatedCards);
        }
      }
      return;
    }

    // ... игра продолжается
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера в интервале
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate]);


  function handleProzrenie(cards, setCards, setGameStatus, status, setProzrenieUsed) {
    if (setProzrenieUsed()) return;
  
    setProzrenieUsed(true);
  
    const closedCards = cards.filter(card => !card.open); // Находим все закрытые карты
  
    // Открываем все закрытые карты на 5 секунд
    setCards(prevCards =>
      prevCards.map(card => {
        if (closedCards.some(closedCard => closedCard.id === card.id)) {
          return { ...card, open: true };
        }
        return card;
      })
    );
  
    if (status === "STATUS_IN_PROGRESS") {
      setGameStatus("STATUS_PAUSED");
  
      setTimeout(() => {
        // Закрываем открытые карты обратно
        setCards(prevCards =>
          prevCards.map(card => {
            if (closedCards.some(closedCard => closedCard.id === card.id)) {
              return { ...card, open: false };
            }
            return card;
          })
        );
        setGameStatus("STATUS_IN_PROGRESS");
        setProzrenieUsed(false);
      }, 5000);
    }
  }
  

  

  function handleAlohomoa(cards, setCards, setAlohomoaUsed) {
    if (setAlohomoaUsed(true)) return; // Используйте setAlohomoaUsed с аргументом для установки состояния
  
    const closedCards = cards.filter(card => !card.open);
    const randomIndex = Math.floor(Math.random() * closedCards.length);
    const firstCard = closedCards[randomIndex];
    const secondCard = closedCards.find(card =>
      card.id !== firstCard.id && card.suit === firstCard.suit && card.rank === firstCard.rank
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
  
    setTimeout(() => setAlohomoaUsed(false), 5000); // Сброс флага после 5 секунд
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
          <div className={styles.powers}>
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
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
            showLeaderboardPrompt={showLeaderboardPrompt}
          />
        </div>
      ) : null}
      <div className={styles.attempts}>
        <div >Число попыток:</div>
        <div className={styles.attempt}>{remainingAttempts}</div>
      </div>
    </div>
  );
}