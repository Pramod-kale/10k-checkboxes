import { TGameInitData } from '../App';

type Props = {
    jumpToIndex: (index: number) => void;
    totalCheckboxes: number;
    checkedBoxes: Set<number>;
    gameInitialData: TGameInitData
}

const Header = ({ jumpToIndex, totalCheckboxes, checkedBoxes, gameInitialData }: Props) => {
    return (
        <div className="header-container">
            <div className="creator">
                <p>Created by <a href=""> Pramod kale </a>  </p>
            </div>
            <div className="title">
                <h1>10k Checkboxes</h1>
                <p>check the boxes, they will be checked in other's window also. same happens when they do it.</p>
            </div>
            <div className="progress">
                <div>
                    <input
                        type="number"
                        className="jump-to-index"
                        onChange={(e) => {
                            jumpToIndex(parseInt(e.target.value, 10))
                        }}
                        placeholder="Jump to index"
                    />
                    <p className='total-count'>{Array.from(checkedBoxes)?.length || 0} / {totalCheckboxes} Checked ✅ </p>
                </div>
                <p className='total-players'>{gameInitialData?.playersJoined} Online</p>
            </div>
        </div>
    )
}

export default Header