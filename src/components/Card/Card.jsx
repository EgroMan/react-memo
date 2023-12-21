import { CROSS_SUIT, DIAMONDS_SUIT, HEARTS_SUIT, SPADES_SUIT } from "../../const";
import styles from "./Card.module.css";

import heartsImageUrl from "./images/hearts.svg";
import crossImageUrl from "./images/cross.svg";
import spadesImageUrl from "./images/spades.svg";
import diamondsImageUrl from "./images/diamonds.svg";
import cardShirtImageUrl from "./images/сard-shirt.svg";

import cn from "classnames";

const images = {
  [HEARTS_SUIT]: heartsImageUrl,
  [CROSS_SUIT]: crossImageUrl,
  [SPADES_SUIT]: spadesImageUrl,
  [DIAMONDS_SUIT]: diamondsImageUrl,
};

const OpenCard = ({ rank, suit }) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.rank}>
          <div className={styles.rankContainer}>
            {rank}
            <img className={styles.rankImage} src={images[suit]} alt={suit} />
          </div>
        </div>
        <div className={styles.suit}>
          {images[suit] && <img className={styles.suitImage} src={images[suit]} alt={suit} />}
        </div>
        <div className={cn(styles.flippedRank, styles.rank)}>
          <div className={styles.rankContainer}>
            {rank}
            <img className={styles.rankImage} src={images[suit]} alt={suit} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ClosedCard = ({ onClick }) => (
  <button onClick={onClick} className={cn(styles.card, styles.cardClosed)}>
    <img src={cardShirtImageUrl} alt="card shirt" />
  </button>
);

export function Card({ onClick, suit, rank, open }) {
  const isCardOpen = open ? styles.open : '';

  const handleCardClick = () => {
    if (!open) {
      onClick(); // переход к логике обработчика клика только если карта закрыта
    }
  };

  return (
    <div className={`${styles.card} ${isCardOpen}`} onClick={handleCardClick}>
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <ClosedCard />
        </div>
        <div className={styles.cardBack}>
          <OpenCard suit={suit} rank={rank} />
        </div>
      </div>
    </div>
  );
}
