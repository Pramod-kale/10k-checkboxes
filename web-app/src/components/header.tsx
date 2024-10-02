import { TGameInitData } from '../App';

type Props = {
    jumpToIndex: (index: number) => void;
    totalCheckboxes: number;
    checkedBoxes: Set<number>;
    gameInitialData: TGameInitData
}

const Header = ({ jumpToIndex, totalCheckboxes, checkedBoxes, }: Props) => {

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const number = Number(formData.get("number")) - 1
        if (number < 0 || number > 10000) {
            return
        }
        jumpToIndex(number)
    }

    return (
        <div className="header-container">
            <div className="title-fz">
                <h1>10k Checkboxes</h1>
                <p>You check the boxes, they check the boxes everybody check the boxes.</p>
            </div>
            <div className="creator">
                <p className='link-holder'>Created by <a className='link' href=""> Pramod kale </a></p>
            </div>
            <div className="title">
                <h1>10k Checkboxes</h1>
                <p>You check the boxes, they check the boxes everybody check the boxes.</p>
            </div>
            <form onSubmit={onSubmit} className="progress">
                <input
                    type="number"
                    id='number'
                    name="number"
                    className="jump-to-index"
                    placeholder="Jump to index"
                    max={10000}
                    min={1}
                />
                <p className='total-count'>{Array.from(checkedBoxes)?.length || 0} / {totalCheckboxes} Checked ✅ </p>
                {/* <p className='total-players'>{gameInitialData?.playersJoined} Online</p> */}
            </form>
        </div>
    )
}

export default Header