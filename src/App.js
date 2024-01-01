import {useState} from "react";
import confetti from "canvas-confetti"
import {Square} from "./components/Square";
import {TURNS} from "./constants";
import {checkWinnerFrom, checkEndGame} from "./logic/board";
import {WinnerModal} from "./components/WinnerModal";
import {resetGameToStorage, saveGameToStorage} from "./logic/storage";

function App() {
    //Los useState siempre tienen que estar dentro del cuerpo del componente
    //Prohibido que esten en un if o un loop

    const [board, setBoard] = useState(() =>{
        const boardFromStorage = window.localStorage.getItem('board')
        return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
        /*
        Otra manera de hacerlo es :
        if(boardFromStorage) return JSON.parse(boardFromStorage)
        return Array(9).fill(null)
        debido a que no es necesario poner un else por los return
        */
    })

    const [turn, setTurn] = useState(() => {
        const turnFromStorage = window.localStorage.getItem('turn')
        return turnFromStorage ?? TURNS.X
    })
    const [winner, setWinner] = useState(null)

    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setTurn(TURNS.X)
        setWinner(null)
        resetGameToStorage()
    }

    const updateBoard = (index) => {
        //No actualices mas si hay algo
        if(board[index] || winner) return

        //Actualizar tablero
        const newBoard = [...board]
        newBoard[index] = turn
        setBoard(newBoard)

        //Cambiar turno
        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
        setTurn(newTurn)

        saveGameToStorage({
            board: newBoard,
            turn: newTurn
        })

        //Revisar si hay ganador
        const newWinner = checkWinnerFrom(newBoard)
        if(newWinner){
            confetti()
            setWinner(newWinner) //Asincrono
        } else if (checkEndGame(newBoard)) {
            setWinner(false)
        }
    }


  return(
      <main className='board'>
        <h1>Tic Tac Toe</h1>
        <button onClick={resetGame}>Reset del juego</button>
        <section className='game'>
          {
            board.map((_, index) =>{
              return(
                  <Square
                      key={index}
                      index={index}
                      updateBoard={updateBoard}
                  >
                      {board[index]}
                  </Square>
              )
            })
          }
        </section>

        <section className='turn'>
            <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
            <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
        </section>

          <WinnerModal resetGame={resetGame} winner={winner} />
      </main>
  )
}

export default App;
