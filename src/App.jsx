import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchDataFromApi } from "./utils/api";

import { useSelector, useDispatch } from 'react-redux';
import { getApiConfiguration, getGenres } from './store/homeSlice';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './Pages/home/Home';
import Details from './Pages/details/Details';
import SearchResult from './Pages/searchResult/SearchResult';
import Explore from './Pages/explore/Explore';
import pageNotFound from './Pages/404/pageNotFound';

function App ()
{
  const dispatch = useDispatch();
  const { url } = useSelector( ( state ) =>
    state.home );
  console.log( url );

  useEffect( () =>
  {
    fetchApiConfig();
    genresCall();
  }, [] );

  const fetchApiConfig = () =>
  {
    fetchDataFromApi( '/configuration' )
      .then( ( res ) =>
      {
        console.log( res );

        const url = {
          backdrop: res.images.secure_base_url + "original",
          poster: res.images.secure_base_url + "original",
          profile: res.images.secure_base_url + "original",
        };
        dispatch( getApiConfiguration( url ) );
      } );
  };

  const genresCall = async() => {
    let promises = []
    let endPoints = ["tv", "movie"]
    let allGenres = {}
    
    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`))
    })

    const data = await Promise.all(promises);
    console.log(data);
    data.map(({genres}) => {
      return genres.map((item) => (
        allGenres[item.id] = item
      ));
    });
    dispatch(getGenres(allGenres));
  }
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/:mediaType/:id" element={ <Details /> } />
        <Route path="/search/:query" element={ <SearchResult /> } />
        <Route path="/explore/:mediaType" element={ <Explore /> } />
        <Route path="*" element={ <pageNotFound /> } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App
