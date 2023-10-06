import './App.css'
import AudioRecorder from './components/AudioRecord'

import TransparantLogo from "./assets/nooby-low-resolution-logo-color-on-transparent-background.png"
import Footer from './components/Footer'

function App() {


  return (
    <>
      <div className='w-full h-full '>
        <div className='flex flex-col'>


          <div className='lg:w-[400px] md:w-[300px] mx-auto lg:mt-28 md:mt-10 hover:scale-105 transition-all duration-300 ease-in-out'>
            <img className='max-w-full h-auto object-cover' src={TransparantLogo} />
          </div>

          <AudioRecorder />

        </div>
        <Footer />
      </div>
    </>
  )
}

export default App
