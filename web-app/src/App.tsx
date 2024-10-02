import { useRef, useState } from 'react'
import './App.css'
import Header from './components/header'
import CheckboxContainer from "./components/checkboxes"
import { VariableSizeGrid as Grid } from 'react-window';
import { useCheckboxesUpdate } from './util/supabase';
import Loader from './components/loader';


const config = {
  totalCheckboxes: 10000,
}

export type TGameInitData = {
  playersJoined: number,
  totalChecked: number
}

const App = () => {
  const gridRef = useRef<Grid>(null);

  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [checkedBoxes, setCheckedBoxes] = useState<Set<number>>(new Set());

  const [gameDataInit, setGameDataInit] = useState<TGameInitData>({ playersJoined: 0, totalChecked: 0 })

  const [updateCheckbox, connectionStatus] = useCheckboxesUpdate(payload => {
    const checkboxDataArray = Array.from(payload)
    setGameDataInit(prev => ({ ...prev, totalChecked: checkboxDataArray.length, }))
    setCheckedBoxes(payload)
  })
  console.log('connectionStatus', connectionStatus)

  // useSubscribePlayerChannel(updatedCount => {
  //   setGameDataInit(prev => ({ ...prev, playersJoined: updatedCount }))
  // })

  const handleCheckboxChange = (checkedSet: Set<number>) => {
    setHighlightedIndex(null)
    setCheckedBoxes(checkedSet)
    updateCheckbox(checkedSet)
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

  return (
    <div className='main-container'>
      <Header
        jumpToIndex={scrollToIndex}
        totalCheckboxes={config.totalCheckboxes}
        checkedBoxes={checkedBoxes}
        gameInitialData={gameDataInit as TGameInitData}
      />
      {
        connectionStatus === "loading"
          ?
          <Loader />
          :
          <CheckboxContainer
            ref={gridRef}
            checkBoxesCount={config.totalCheckboxes}
            handleCheckboxChange={handleCheckboxChange}
            highlightedIndex={highlightedIndex}
            checkBoxStateWS={checkedBoxes}
          />
      }
    </div>
  )
}

export default App
