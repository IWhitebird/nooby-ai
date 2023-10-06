import React, { useState } from 'react';
import OpenAI from 'openai';

const AudioRecorder: React.FC = () => {

  const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true 
  });


  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioRecording, setAudioRecording] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>('');

  const { SpeechRecognition, webkitSpeechRecognition } = window;
  const recognition = SpeechRecognition || webkitSpeechRecognition;
  const recognitionInstance: SpeechRecognition = new recognition();

  const startRecording = async () => {

    async function callOpenAI() {
      try {
        const chatCompletion = await openai.chat.completions.create({
          messages: [{ role: 'user', content: transcription }],
          model: 'gpt-3.5-turbo',
        });
    
        console.log(chatCompletion.choices);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });

        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.play();

        recognitionInstance.lang = 'en-US'; 
        
        

        recognitionInstance.onresult = (event) => {
          const transcription = event.results[0][0].transcript;
          console.log('Transcription:', transcription);
          setTranscription(transcription);  
        };
        
        callOpenAI();

      };

      mediaRecorder.start();
      recognitionInstance.start();
      setAudioRecording(true);
    } catch (error) {
      console.error('Error starting audio recording:', error);
    }
  };

  const stopRecording = () => {
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
      setAudioRecording(false);
    }
  };

  return (
    <div className='mx-auto flex flex-col justify-center items-center mt-6'>
      <div className='mx-auto'>
        <button
          className='text-2xl lg:w-[250px] lg:h-[60px] hover:scale-110 transition-all duration-200 ease-in-out
          bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={audioRecording ? stopRecording : startRecording}
        >
          {audioRecording ? 'Stop' : 'Ask a question'}
        </button>
      </div>

      <div className='mt-5'>
        {audioRecording && (
          <div className="boxContainer">
            <div className="box box1"></div>
            <div className="box box2"></div>
            <div className="box box3"></div>
            <div className="box box4"></div>
            <div className="box box5"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
