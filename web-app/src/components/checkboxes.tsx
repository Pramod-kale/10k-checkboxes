import { useEffect, useState, forwardRef, useCallback } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';

type Props = {
    checkBoxesCount: number;
    handleCheckboxChange: (checkedSet: Set<number>) => void;
    highlightedIndex: number | null;
    checkBoxStateWS: Set<number>;
};

const CheckboxesContainer = forwardRef<Grid, Props>(
    ({ checkBoxesCount, handleCheckboxChange, highlightedIndex, checkBoxStateWS }: Props, ref) => {
        const rowHeight = 50;
        const columnWidth = 50;
        const totalCheckboxes = checkBoxesCount;

        const [checkedBoxes, setCheckedBoxes] = useState<Set<number>>(new Set());
        const latestChecked = Array.from(checkedBoxes).slice(-5);

        const [dimensions, setDimensions] = useState({
            height: window.innerHeight - 170,
            width: window.innerWidth * 0.97,
        });

        const calculateTable = useCallback(() => {
            const columns = Math.floor((window.innerWidth * 0.97) / columnWidth);
            const rows = Math.ceil(totalCheckboxes / columns);
            return { columns, rows };
        }, [totalCheckboxes])

        const [table, setTable] = useState<{ columns: number; rows: number }>(calculateTable);

        useEffect(() => {
            const handleResize = () => {
                setDimensions({ height: window.innerHeight - 170, width: window.innerWidth * 0.97 });
                setTable(calculateTable());
            };

            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }, [calculateTable, totalCheckboxes]);

        const onCheckboxChange = (index: number) => {
            const newChecked = new Set(checkedBoxes);
            if (newChecked.has(index)) {
                newChecked.delete(index);
            } else {
                newChecked.add(index);
            }
            handleCheckboxChange(newChecked);
            setCheckedBoxes(() => newChecked);
        };

        useEffect(() => {
            setCheckedBoxes(checkBoxStateWS);
        }, [checkBoxStateWS]);

        const renderCheckbox = (columnIndex: number, rowIndex: number, style: React.CSSProperties) => {

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { height, width, ...restStyles } = style
            const index = rowIndex * table.columns + columnIndex;
            if (index >= totalCheckboxes) return null;

            const isChecked = checkedBoxes.has(index);
            const isHighlighted = highlightedIndex === index;
            const recentCheckedHighlight = latestChecked.includes(index);

            return (
                <div
                    className={`checkbox-holder ${isHighlighted ? 'checkbox-highlight' : ''}`}
                    style={{
                        ...restStyles,
                        borderRadius: '2px',
                        border: recentCheckedHighlight ? `1px solid #d5d5d5` : 'none',
                    }}
                >
                    <input
                        type='checkbox'
                        id={'checkbox' + index}
                        checked={isChecked}
                        onChange={() => onCheckboxChange(index)}
                    />
                </div>
            );
        };

        return (
            <div className='checkbox-container'>
                <Grid
                    ref={ref}
                    style={{ margin: '10px auto' }}
                    columnCount={table.columns}
                    rowCount={table.rows}
                    columnWidth={() => columnWidth}
                    rowHeight={() => rowHeight}
                    height={dimensions.height}
                    width={dimensions.width}
                >
                    {({ columnIndex, rowIndex, style }) => renderCheckbox(columnIndex, rowIndex, style)}
                </Grid>
            </div>
        );
    }
);

export default CheckboxesContainer;
