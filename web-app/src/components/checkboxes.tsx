import { useEffect, useState, forwardRef } from 'react'
import { VariableSizeGrid as Grid } from 'react-window';
import { generateRandomColor } from '../util/randomColorGen';


type Props = {
    checkBoxesCount: number
    handleCheckboxChange: (checkedSet: Set<number>) => void;
    highlightedIndex: number | null;
    checkBoxStateWS: Set<number>
}
//const MyInput = forwardRef(function MyInput(props, ref) {
console.clear()


const CheckboxesContainer = forwardRef<Grid, Props>(({ checkBoxesCount, handleCheckboxChange, highlightedIndex, checkBoxStateWS }: Props, ref) => {

    // constants
    const rowHeight = 50;
    const columnWidth = 50;
    const totalCheckboxes = checkBoxesCount;
    const [checkedBoxes, setCheckedBoxes] = useState<Set<number>>(new Set());
    const latestChecked = Array.from(checkedBoxes).slice(-8)
    const [dimensions, setDimensions] = useState({ height: window.innerHeight - 170, width: window.innerWidth * 0.97 })
    const [table, setTable] = useState<{ columns: number, rows: number }>({ columns: Math.round((window.innerWidth * 0.97) / columnWidth), rows: totalCheckboxes / Math.round((window.innerWidth * 0.97) / columnWidth) })


    useEffect(() => {
        setDimensions({ height: window.innerHeight - 170, width: window.innerWidth * 0.97 })
        setTable({ columns: Math.round((window.innerWidth * 0.97) / columnWidth), rows: totalCheckboxes / Math.round((window.innerWidth * 0.97) / columnWidth) })

        window.addEventListener('resize', () => {
            setDimensions({ height: window.innerHeight - 170, width: window.innerWidth * 0.97 })
            setTable({ columns: Math.round((window.innerWidth * 0.97) / columnWidth), rows: totalCheckboxes / Math.round((window.innerWidth * 0.97) / columnWidth) })
        })
        return () => {
            window.removeEventListener('resize', () => {
                setDimensions({ height: window.innerHeight - 170, width: window.innerWidth * 0.97 })
                setTable({ columns: Math.round((window.innerWidth * 0.97) / columnWidth), rows: totalCheckboxes / Math.round((window.innerWidth * 0.97) / columnWidth) })
            })
        }
    }, [totalCheckboxes])

    const onCheckboxChange = (index: number) => {
        const newChecked = new Set(checkedBoxes);
        if (newChecked?.has(index)) {
            newChecked?.delete(index);
        } else {
            newChecked?.add(index);
        }
        handleCheckboxChange(newChecked)
        setCheckedBoxes(() => newChecked);
    };

    useEffect(() => {
        setCheckedBoxes(checkBoxStateWS)
    }, [checkBoxStateWS])


    return (
        <div className='checkbox-container'>
            <Grid
                ref={ref}
                style={{ margin: "10px auto" }}
                columnCount={table.columns}
                rowCount={table.rows}

                columnWidth={() => columnWidth}
                rowHeight={() => rowHeight}

                height={dimensions.height}
                width={dimensions.width}
            >
                {
                    ({ columnIndex, rowIndex, style }) => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { height, width, ...rest } = style;
                        const index = rowIndex * table.columns + columnIndex;
                        const isChecked = checkedBoxes?.has(index);
                        const isHighlighted = highlightedIndex === index;
                        const recentCheckedHighlight = latestChecked.includes(index)
                        return (
                            <div
                                className={`checkbox-holder ${isHighlighted ? 'checkbox-highlight' : ''}`}
                                style={{
                                    ...rest,
                                    boxShadow: recentCheckedHighlight ? `0 0 3px 3px ${generateRandomColor()}` : "none"
                                }}>
                                <input
                                    type="checkbox"
                                    name=""
                                    id={"checkbox" + index}
                                    checked={isChecked}
                                    onChange={() => onCheckboxChange(index)}
                                />
                            </div>
                        )
                    }
                }
            </Grid>
        </div>
    )
})


export default CheckboxesContainer
