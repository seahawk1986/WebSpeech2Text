'use strict'

let log = console.log.bind(console),
  id = val => document.getElementById(val),
  ul = id('ul'),
  gUMbtn = id('gUMbtn'),
  start = id('start'),
  stop = id('stop'),
  stream,
  recorder,
  counter=1,
  chunks,
  media;


// gUMbtn.onclick = e => {
window.onload = e => {
  let mv = id('mediaVideo'),
      mediaOptions = {
        audio: {
          tag: 'audio',
          type: 'audio/ogg',
          ext: '.ogg',
          gUM: {audio: true}
        }
      };
  media = mediaOptions.audio;
  navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
    stream = _stream;
    // id('gUMArea').style.display = 'none';
    id('btns').style.display = 'inherit';
    start.removeAttribute('disabled');
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
      chunks.push(e.data);
      if(recorder.state == 'inactive') {
        makeLink();
      };
    };
    log('got media successfully');
  }).catch(log);
}

start.onclick = e => {
  start.disabled = true;
  stop.removeAttribute('disabled');
  chunks=[];
  recorder.start();
}


stop.onclick = e => {
  stop.disabled = true;
  recorder.stop();
  start.removeAttribute('disabled');

}

function makeTranscribeBtn() {

  li = document.createElement('li');
  li.appendChild(btn)
  ul.appendChild(li)
}

function makeLink(){
  let blob = new Blob(chunks, {type: media.type })
    , url = URL.createObjectURL(blob)
    , li = document.createElement('li')
    , mt = document.createElement(media.tag)
    , hf = document.createElement('a')
  ;
  mt.controls = true;
  mt.src = url;
  hf.href = url;
  hf.download = `${counter++}${media.ext}`;
  hf.innerHTML = `donwload ${hf.download}`;

  let btn = document.createElement("button");
  btn.data = "Hi"
  btn.innerHTML = "Spracherkennung";
  btn.classList.add("spinner");

    li.appendChild(mt);
    // li.appendChild(hf);
    li.appendChild(btn)
    ul.appendChild(li);

  const formData = new FormData();
  blob.arrayBuffer().then(buf => {
    formData.append("audio", blob, "audio.ogg");
    btn.disabled = true;
    btn.innerHTML = "Spracherkennung läuft...";
    fetch(`../upload_audio`, {method:"POST", body: formData})
            .then(response => {
                if (response.ok) return response;
                else throw Error(`Server returned ${response.status}: ${response.statusText}`)
            })
            .then(response => response.json().then(json_data => {
              const txt = document.createTextNode(json_data.text);
              const d = document.createElement("div");
              d.appendChild(txt);
              li.appendChild(d);
              btn.innerHTML="Fertig"
              btn.classList.remove("spinner");
            }))
            .catch(err => {
                alert(err);
            });
    }
);
}