import React from 'react'
import spinner from './spinner.gif'

/**
 * React functional component
 * @returns {JSX.Element} gif spinner
 */
export const Spinner = () => (
    <span>
        <img
            src={spinner}
            alt="Loading..."
            style={{
                width: '260px',
                heigth: '160px',
                marginLeft: '45%',
                paddingTop: '300px',
                backgroundColor: 'transparent',
                opacity: '.8',
                position: 'absolute',
                zIndex: 100,
            }}
        />
    </span>
)
