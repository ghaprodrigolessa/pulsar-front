/* eslint eqeqeq: "off" */
import React, { useState } from 'react';

import microfone from '../images/microfone.svg';
import salvar from '../images/salvar.svg';
import deletar from '../images/deletar.svg';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

function Gravador({ funcao, continuo }) {
  const [btngravavoz, setbtngravavoz] = useState("button-green");

  // speech-recognition.
  const {
    transcript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div id="btngravavoz" className={btngravavoz}
        style={{ display: 'flex', width: 50, height: 50 }}
        onClick={listening ?
          () => {
            // não faz nada.
          } :
          (e) => {
            document.getElementById("btngravavoz").style.pointerEvents = 'none';
            setbtngravavoz("gravando");
            SpeechRecognition.startListening({continuous: continuo});
            e.stopPropagation();
          }}
      >
        <img
          alt=""
          src={microfone}
          style={{
            margin: 10,
            height: 30,
            width: 30,
          }}
        ></img>
      </div>
      <div id="lista de resultados"
        className="button"
        style={{
          top: 0, bottom: 0, left: 0, right: 0,
          alignSelf: 'center',
          width: window.innerWidth < 426 ? '70vw' : '',
          minWidth: window.innerWidth < 426 ? '70vw' : '',
          maxWidth: window.innerWidth < 426 ? '70vw' : '',
          backgroundColor: 'grey',
          display: btngravavoz == "gravando" ? 'flex' : 'none',
          flexDirection: 'column', justifyContent: 'center', width: 150, padding: 20,
        }}>
        {transcript.toUpperCase()}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div id="botão excluir" className='button-red'
            style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
            onClick={(e) => {
              SpeechRecognition.stopListening();
              resetTranscript();
              setbtngravavoz("button-green");
              document.getElementById("btngravavoz").style.pointerEvents = 'auto';
              e.stopPropagation();
            }}>
            <img
              alt=""
              src={deletar}
              style={{
                margin: 10,
                height: 25,
                width: 25,
              }}
            ></img>
          </div>
          <div id="botão salvar" className='button-green'
            style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
            onClick={(e) => {
              SpeechRecognition.stopListening();
              setbtngravavoz("button-green");
              funcao([transcript.toUpperCase()]);
              document.getElementById("btngravavoz").style.pointerEvents = 'auto';
              e.stopPropagation();
            }}>
            <img
              alt=""
              src={salvar}
              style={{
                margin: 10,
                height: 25,
                width: 25,
              }}
            ></img>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gravador;