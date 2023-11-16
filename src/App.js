import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import sound from './assests/beep.mp3';


let Interval;

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [currentMinutes, setCurrentMinutes] = useState(25);
  const [currentSeconds, setCurrentSeconds] = useState(60);
  const [isReached, setIsReached] = useState(false);

  const [isRunning, setIsRunning] = useState(false);



  useEffect(() => {
    let interval;


    if (isRunning) {

      if (currentSeconds === 60) {
        setTimeout(() => {

          setCurrentMinutes(prev => prev - 1);

        }, 1000);
      }

      interval = setInterval(() => {
        setCurrentSeconds((prev) => (prev > 0 ? prev - 1 : prev));

      }, 1000);

    }

    return () => clearInterval(interval);

  }, [isRunning]);



  useEffect(() => {

    if (currentSeconds === 0) {

      if (currentMinutes === 0) {

        console.log(currentMinutes, currentSeconds, "inside");

        setIsReached(prev => !prev);

        let audio = document.querySelector('audio');

        const promise = audio.play()

        if (promise !== null) {
          promise.catch(() => audio.play());
        }

        setIsRunning(false);

        setTimeout(() => {
          if (!isReached) {
            setCurrentMinutes(breakLength);
          } else {
            setCurrentMinutes(sessionLength);
          }
          setCurrentSeconds(60);
          setIsRunning(true);
        }, 1000);


      } else {
        setTimeout(() => {
          setCurrentMinutes(prev => prev - 1);
          setCurrentSeconds(60);
        }, 100);
      }
    }

  }, [currentSeconds])




  /******************** ANOTHER WAY **************************** */

  // const handleClick = (operation) => {
  //   if (operation === 'start') {
  //     handleTime(false);
  //   }

  //   if (operation === 'pause') {
  //     handleTime(true);
  //   }

  //   if (operation === 'reset') {
  //     handleTime(true);
  //     setCurrentTime(25);
  //   }
  // }

  // function handleTime(dontCall) {

  //   if (dontCall) {
  //     clearTimeout(Interval);
  //     console.log('Timer paused');
  //     return;
  //   }

  //   Interval = setTimeout(() => {
  //     console.log('running...');
  //     setCurrentTime((prev) => prev - 1);
  //     handleTime(false);
  //   }, 1000);
  // }

  /**************************************************************************** */


  const handleReset = () => {

    setIsRunning(false);
    setCurrentMinutes(25);
    setCurrentSeconds(60);
    setSessionLength(25);
    setBreakLength(5);
    setIsReached(false);

    let audio = document.querySelector('audio');
    audio.pause();
    audio.currentTime = 0;

  }

  const handleSession = (operation) => {

    setIsReached(false);

    if (operation === 'decrease') {
      setSessionLength(prev => prev <= 1 ? prev : prev - 1);
      setCurrentMinutes(sessionLength === 1 ? sessionLength : sessionLength - 1);
      setCurrentSeconds(60);
    } else {
      setSessionLength(prev => prev >= 60 ? prev : prev + 1)
      setCurrentMinutes(sessionLength + 1);
      setCurrentSeconds(60);
    }

  }


  return (
    <div className="App">
      <main>
        <section className='first'>
          <span className='heading'>25 + 5 Clock</span>
        </section>
        <section className='middle'>
          <div id='break-label'>

            <h1>Break Length</h1>
            <div className='break-length-wrapper'>
              <i class="fa-solid fa-arrow-down-long" id='break-decrement' onClick={() => !isRunning && setBreakLength(prev => prev <= 1 ? prev : prev - 1)}></i>
              <span id='break-length'>{breakLength}</span>
              <i class="fa-solid fa-arrow-up" id='break-increment' onClick={() => !isRunning && setBreakLength(prev => prev >= 60 ? prev : prev + 1)}></i>
            </div>

          </div>
          <div id='session-label'>

            <h1>Session Length</h1>

            <div className='session-length-wrapper'>
              <i class="fa-solid fa-arrow-down-long" id='session-decrement' onClick={() => !isRunning && handleSession('decrease')}></i>
              <span id='session-length'>{sessionLength}</span>
              <i class="fa-solid fa-arrow-up" id='session-increment' onClick={() => !isRunning && handleSession('increase')}></i>
            </div>

          </div>
        </section>
        <section className='last'>
          <div className='timer-wrapper'>
            <span id='timer-label'>{isReached ? 'Break' : 'Session'}</span>
            <div id='time-left'>
              <span>{currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}:{currentSeconds < 10 ? `0${currentSeconds}` : (currentSeconds === 60 ? `00` : currentSeconds)}</span>
            </div>
          </div>
          <div className='button-wrapper'>

            <i class="fa-solid fa-play" id='start_stop' onClick={() => setIsRunning((prev) => !prev)}></i>
            <i class="fa-solid fa-circle-notch" id='reset' onClick={handleReset}></i>

          </div>
        </section>
        <audio id='beep' style={{}} src={sound}></audio>
      </main>
    </div>
  );
}

export default App;
