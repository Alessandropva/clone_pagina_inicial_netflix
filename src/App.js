import React, {useEffect, useState} from 'react';
import './App.css';
import Tmdb from './tmdb';
import MovieRow from './components/moviRows';
import FeaturedMovie from './components/featuredmovie';
import Header from './components/header';

function App() {
 const [movieList, setMovieList] = useState([]);
 const [featuredData,setFeaturedData] = useState([]);
 const [blackHeader, setBlackHeader] =  useState(false);
 
  useEffect(()=>{
    const loadAll = async ()=>{
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //pegando o Fiatured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);

    }
    loadAll();
  },[]);
  
  useEffect(()=>{
      const scrollListener = ()=>{
          if(window.scrollY > 10){
             setBlackHeader(true);
          }else{
            setBlackHeader(false);
          }
      }
      window.addEventListener('scroll', scrollListener);
      return ()=>{
        window.removeEventListener('scroll', scrollListener);
      }
  },[]);
  return (
    <div className="page">
      <Header black={blackHeader}/>
      {featuredData && <FeaturedMovie item={featuredData}/>  }
     
       <section className="lists">
        {movieList.map((item, key)=>(
          <div>
            <MovieRow key={key} title={item.title} items={item.items}/>
          </div>
        ))}
       </section>
       <footer>
          
          Direitos de imagem para NetFlix<br/>
          Dados pegos do site Themoviedb.org
       </footer>
       {movieList <= 0 && 
       <div className="loading">
         <img src="./images/Netflix_LoadTime.gif" alt="Carregando"/>
       </div>
       }
    </div>
  );
}

export default App;
