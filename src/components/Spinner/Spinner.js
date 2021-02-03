import React from 'react'
import spinner from './spinner.gif'

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
                opacity: '.8'
            }}
        />
    </span>
)
