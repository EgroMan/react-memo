import styles from "./EndGameModal.module.css"
import {gameRegimeReducer} from "../../store/slicegame"
import { useDispatch } from "react-redux"

export function CheckboxFunc() {
  const dispatch = useDispatch();

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    dispatch(gameRegimeReducer(checked ? "threeMistakes" : "default")); // Используйте gameRegimeReducer для обновления режима игры в вашем хранилище
  };

  return (
    <div className={styles.checkbox}>
      <h2>Режим до трех ошибок</h2>
      <input 
        id="checkBoxInput"  
        className={styles.custom__box} 
        type="checkbox"
        onChange={handleCheckboxChange} 
      />
      <label htmlFor="checkBoxInput"></label>
    </div>
  );
}
