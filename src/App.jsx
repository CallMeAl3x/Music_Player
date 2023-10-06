import cover1 from './assets/imgs/cover-1.png';
import cover2 from './assets/imgs/cover-2.png';
import stop_and_play from './assets/icons/Stop_and_play_fill.svg';
import play from './assets/icons/Play_fill.svg';
import stop_and_play_reverse from './assets/icons/Stop_and_play_fill_reverse.svg';
import pause from './assets/icons/pause.svg';
import song1 from './assets/songs/forest-lullaby-110624.mp3';
import song2 from './assets/songs/lost-in-city-lights-145038.mp3';
import { useState, useRef } from 'react';

const App = () => {

  const [audioProgress, setAudioProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicIndex, setmusicIndex] = useState(0);
  const currentAudio = useRef()
  const [musicTotalLength, setmusicTotalLength] = useState('04 : 38');
  const [musicCurrentTime, setmusicCurrentTime] = useState('00 : 00');

  //Afficher la première musique
  const [currentMusicDetails, setCurrentMusicDetails] = useState({
    songName: 'Lost in the City Lights',
    songArtist: 'Cosmo Sheldrake',
    songSrc: song1,
    songAvatar: cover1
  })

  //Naviguer entre les musiques
  const musicAPI = [
    {
    songName: 'Lost in the City Lights',
    songArtist: 'Cosmo Sheldrake',
    songSrc: song1,
    songAvatar: cover1
    },

    {
      songName: 'Forest Lullaby',
      songArtist: 'Lesfm',
      songSrc: song2,
      songAvatar: cover2
      },
  ]

  //Bouton Play/Pause
  const handleAudioPlay = () => {
    if (currentAudio.current.paused) {
      currentAudio.current.play();
      setIsPlaying(true);
    }
     else {
        currentAudio.current.pause();
        setIsPlaying(false);
      }
  }

  //Bouton Next song
  const handleNextSong = () => {
    if (musicIndex >= musicAPI.length - 1) {
      let setNumber = 0;
      setmusicIndex(setNumber);
      updateCurrentMusicDetails(setNumber);
    }
    else {
      let setNumber = musicIndex + 1;
      setmusicIndex(setNumber);
      updateCurrentMusicDetails(setNumber);
    }
  }

  //Bouton Previous song
  const handlePreviousSong = () => {
    if (musicIndex === 0) {
      let setNumber = musicAPI.length - 1;
      setmusicIndex(setNumber);
      updateCurrentMusicDetails(setNumber);
    }
    else {
      let setNumber = musicIndex - 1;
      setmusicIndex(setNumber);
      updateCurrentMusicDetails(setNumber);
    }
  }

  //Mettre à jour les détails
  const updateCurrentMusicDetails = (number)=> {
    let musicObject = musicAPI[number];

    //Attendre que le song charge 
      currentAudio.current.onloadeddata = () => {
      currentAudio.current.play();
      setIsPlaying(true);
    };
    
    currentAudio.current.play();
    setCurrentMusicDetails({
        songName: musicObject.songName,
        songArtist: musicObject.songArtist,
        songSrc: musicObject.songSrc,
        songAvatar: musicObject.songAvatar 
    })
  }

  const handleAudioUpdate = () => {

    //Temps total de la musique
    let minutes = Math.floor(currentAudio.current.duration / 60);
    let secondes = Math.floor(currentAudio.current.duration % 60);
    let musicTotalLength0 = `${minutes <10 ? `0${minutes}` : minutes} : ${secondes <10 ? `0${secondes}` : secondes}`
    setmusicTotalLength(musicTotalLength0);
    //Temps acutel de la musique

    let currentMin = Math.floor(currentAudio.current.currentTime / 60);
    let currentSec = Math.floor(currentAudio.current.currentTime % 60);
    let musicCurrenTime = `${currentMin <10 ? `0${currentMin}` : currentMin} : ${currentSec <10 ? `0${currentSec}` : currentSec}`
    setmusicCurrentTime(musicCurrenTime);

    const progress = parseInt((currentAudio.current.currentTime / currentAudio.current.duration) * 100)
    setAudioProgress(isNaN(progress)? 0 : progress)
  }


  
  const handleMusicProgressBar = (e)=> {
    setAudioProgress(e.target.value);
    currentAudio.current.currentTime = e.target.value * currentAudio.current.duration / 100;
  }

  return (
    <div>
      <section className="card flex flex-col p-4">
      <audio id="audio" src={currentMusicDetails.songSrc}  ref={currentAudio} onEnded={handleNextSong} onTimeUpdate={handleAudioUpdate}></audio>
        <div className='bg-[#212936] rounded-xl max-sm:p-3 text-center max-sm:mt-[25%] mt-16 ml-auto mr-auto max-w-sm p-4'>
          <img 
          src={currentMusicDetails.songAvatar} 
          alt=""
          className='rounded-xl' 
          />
          <h2 className='text-[#E5E7EB] mt-4 font-medium text-lg'>
            {currentMusicDetails.songName}
          </h2>
          <p className='text-[#4D5562] text-md'>{currentMusicDetails.songArtist}</p>

          <div className='timer mt-6 flex justify-between text-[#4D5562] font-bold text-[13px]'>
              <p id='current_time'>{musicCurrentTime}</p>
              <p id='song_time'>{musicTotalLength}</p>
          </div>
          
          <div className='progression -mt-1 rounded-full'>
            <input type="range" name='musicProgressBar' value={audioProgress} onChange={handleMusicProgressBar} className='w-full'/>
          </div>

          <div className='flex align-center justify-center w-full mt-5 mb-2'>
            <img src={stop_and_play} alt="" draggable='false' onClick={handlePreviousSong}/>


            <div className='rounded-full bg-[#C93B76] p-2 mr-3 ml-3'>
            <img src={isPlaying? pause : play} onClick={handleAudioPlay} draggable='false' alt=""/>
            </div>


            <img src={stop_and_play_reverse} alt="" draggable='false' onClick={handleNextSong}/>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App