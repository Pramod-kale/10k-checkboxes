import { useEffect, useRef, useState } from 'react'
import './App.css'
import Header from './components/header'
import CheckboxContainer from "./components/checkboxes"
import { VariableSizeGrid as Grid } from 'react-window';
import { socket } from "./socket.io"


const config = {
  totalCheckboxes: 10000,
}

export type TGameInitData = {
  playersJoined: number,
  totalChecked: number
}

function App() {
  const gridRef = useRef<Grid>(null);

  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [checkedBoxes, setCheckedBoxes] = useState<Set<number>>(new Set());

  const [gameInitialData, setGameInitiallData] = useState<TGameInitData | null>(null)

  const handleCheckboxChange = (checkedSet: Set<number>) => {
    setHighlightedIndex(null)
    setCheckedBoxes(checkedSet)
    socket.emit('checked', Array.from(checkedSet));
  }

  const scrollToIndex = (index: number) => {
    if (isNaN(index)) {
      setHighlightedIndex(null);
      return;
    }

    setHighlightedIndex(index)
    if (gridRef.current) {
      const { columnCount } = gridRef.current.props
      const rowIndex = Math.floor(index / columnCount);
      const columnIndex = index % columnCount;
      gridRef.current.scrollToItem({
        rowIndex,
        columnIndex,
        align: 'center',
      })
    }
  }

  useEffect(() => {

    socket.on("connect", () => {
      console.log('connected as ' + socket.id)
    })

    socket.on("disconnect", () => {
      console.log('disconneted')
    })

    socket.on("ready", (data) => {
      setGameInitiallData(data)
      setCheckedBoxes(new Set(data.totalChecked))
    })
    socket.on("checked", (data) => {
      const updatedSet = new Set([...checkedBoxes, ...data])
      setCheckedBoxes(updatedSet as Set<number>)
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("ready")
      socket.off("checked")
    }

  }, [checkedBoxes])
  return (
    <div className='main-container'>
      <Header
        jumpToIndex={scrollToIndex}
        totalCheckboxes={config.totalCheckboxes}
        checkedBoxes={checkedBoxes}
        gameInitialData={gameInitialData as TGameInitData}
      />
      <CheckboxContainer
        ref={gridRef}
        checkBoxesCount={config.totalCheckboxes}
        handleCheckboxChange={handleCheckboxChange}
        highlightedIndex={highlightedIndex}
        checkBoxStateWS={checkedBoxes}
      />
    </div>
  )
}

export default App
