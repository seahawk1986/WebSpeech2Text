# Spracherkennung als Webservice
Dieses Projekt ist nur als Proof of Concept zu sehen - es bietet eine rudimentäre Webseite an, die über die MediaStream Fähigkeiten von Browsern (https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API) Audio aufzeichnen und an ein Backend mit whisper-ctranslate2 senden kann. Das Ergebnis der Transkription wird dann im Browser angezeigt.

## Installation

````shell
sudo apt install python3-venv git
git clone https://github.com/seahawk1986-hotmail/WebSpeech2Text.git
cd WebSpeech2Text
python3 -m venv .venv
. .venv/bin/activate
pip install -U fastapi faster-whisper
deactivate
````

## Zertifikate erstellen
Da Browser über die MediaStream API nur dann die Möglichkeit anbieten Ton aufzuzeichnen, wenn die Verbindung über HTTPS erfolgt, braucht man zumindest ein nicht vertrauenswrüdiges Zertifikat - das kann man sich so erstellen lassen:
````shell
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
````
Falls man entsprechende Zertifikate für seine Server besitzt, bietet es sich natürlich an, diese zu nutzen.

## Die Webapp im Netzwerk anbieten
````shell
.venv/bin/uvicorn backend:app  --ssl-keyfile key.pem --ssl-certfile cert.pem --host 0.0.0.0 --port 9000
````
Danach sollte die Webapp auf Port 9000 erreichbar sein.

