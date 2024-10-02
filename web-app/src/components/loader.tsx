import { useEffect, useRef } from 'react'
import './loader.css'

const Loader = () => {
    const checkboxRefs = useRef<HTMLInputElement[]>([]);
    const totalCheckboxes = 10;

    useEffect(() => {
        let currentIndex = 0;

        const loaderTimer = setInterval(() => {
            checkboxRefs.current.forEach((checkbox, index) => {
                if (checkbox) {
                    checkbox.checked = index === currentIndex;
                }
            });

            currentIndex++;
            if (currentIndex >= totalCheckboxes) {
                currentIndex = 0;
            }
        }, 100);

        return () => {
            clearInterval(loaderTimer);
        };
    }, []);

    return (
        <div className='loader-container'>
            <div className='loaders'>

                {[...Array(totalCheckboxes)].map((_, index) => (
                    <div className="checkbox-highlight" key={index}>
                        <input
                            ref={(el) => (checkboxRefs.current[index] = el!)}
                            type='checkbox'
                            onChange={event => event.preventDefault()}
                        />
                    </div>
                ))}
            </div>
            Loading...
        </div>
    );
};

export default Loader;
