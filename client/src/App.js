import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Movie from './Movie';
import './style.css';
import { Oval } from 'react-loader-spinner';

function App() {
  const domain = 'http://127.0.0.1:8000';
  const [items, setItems] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const itemsPerPage = 9;
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);

  const incCounter = () => setCounter(counter+1);

  const selectItem = (item, rating) => {
    if (items[item.id - 1].rating === 0) {
      let newItems = items;
      newItems[item.id - 1].rating = rating
      setItems(newItems);
    }
  }

  const filterRatings = () => {
    return items.filter(el => el.rating != 0);
  }

  const sendSelectedMovies = () => {
    if (counter < 30) {
      alert('Вы должны оценить 30 фильмов')
      return;
    }
    setLoading(true)
    fetch(`${domain}/get_prediction`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filterRatings())
    })
      .then(response => response.json())
      .then(result => {
        setLoading(false)
        setPrediction(result)}
      );
    setCurrentItems(null)
  }

  useEffect(() => {
    setLoading(true);
    fetch(`${domain}/get_movies`)
      .then(response =>response.json())
      .then(result => {
        setLoading(false)
        let resObj = JSON.parse(result).map(el => {return {id : el[0], year: el[1], title: el[2], rating: 0}})
        setItems(resObj);
      });

  }, [])

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, items]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="app-wrapper">
      {prediction && <div className='pagination-wrapper'>
        <div className={'pagination-container'}>
          <div className={'pagination-title'}>Рекомендации</div>
        </div>
      </div> }
      <div className='movies-list-wrapper'>
      {loading && <div className={'app-spinner-wrapper'}>
        <Oval color="#00BFFF" height={80} width={80} />
      </div>}
      {!prediction ?
      currentItems && currentItems.map((item) => (
        <Movie
          movie = {item}
          key={item.id}
          selectItem={selectItem}
          prediction={prediction}
          incCounter={incCounter}
        />
        ))
      :
      prediction.map((item) => (
        <Movie
            movie = {item}
            key={item.id}
            selectItem={selectItem}
            prediction={prediction}
            incCounter={incCounter}
        />
      ))
      }
      </div>
      {!loading && !prediction &&
      <div className='pagination-wrapper'>
        <ReactPaginate
          className='pagination-container'
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
        />
      </div>
      }
      {!loading && !prediction && <div className='pagination-send-button-wrapper'>
        <div className='pagination-send-button-container'>
          <div className='pagination-send-button' onClick={() => sendSelectedMovies()}>
            Отправить
          </div>
          <div>
            { `Фильмов оценено: ${counter}`}
          </div>
        </div>
      </div>}
    </div>
  );
}

export default App;
