import React, { useState } from 'react';
import './style.css';

export default function Movie(props) {
    const [rating, setRating] = useState(null);
    const ratingsNumbers = [1,2,3,4,5];

    return (
        <div className={'card-wrapper'}>
            <div className={'card-container'}>
                <div className={'metadata-wrapper'}>
                    <div className='metadata-container'>
                        <div className={'card-title-wrapper'}>
                            <div className={'card-title-container'}>
                                <span className={'card-title'}>{props.movie.title}</span>
                            </div>
                        </div>
                        <div className='card-id-wrapper'>
                            <div className='card-id-container'>
                                <span className={'card-movie-id'}>{`ID: ${props.movie.id}`}</span>
                            </div>
                        </div>
                        <div className='card-date-wrapper'>
                            <div className='card-date-container'>
                                <span className={'card-movie-date'}>{`Год: ${props.movie.year}`}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {!props.prediction &&
                    <div className={'ratings-wrapper'}>
                        <div className={'ratings-container'}>
                            {ratingsNumbers.map((item) =>
                                <div
                                    className='ratings-item'
                                    onClick={() => {
                                            props.selectItem(props.movie, item)
                                            setRating(item)
                                            if (!rating)
                                                props.incCounter()
                                        }
                                    }>
                                {item}
                                </div>
                            )
                            }
                        </div>
                    </div>
                }
                {!props.prediction &&
                    <div>
                        <span>Рейтинг: {rating ? rating : '0'} </span>
                    </div>
                }
            </div>
        </div>
    )
}