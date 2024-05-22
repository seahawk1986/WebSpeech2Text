import io
import ssl
from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from faster_whisper import WhisperModel

app = FastAPI()
ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain('cert.pem', keyfile='key.pem')
app.mount("/static", StaticFiles(directory="static"), name="static")
model = WhisperModel("base", device="cpu")

@app.get("/")
def get_root():
    return RedirectResponse("static/index.html")

@app.post("/upload_audio")
async def process_audio(audio: UploadFile):
    audio_file = io.BytesIO(await audio.read())
    segments, info = model.transcribe(audio_file, language='de', condition_on_previous_text=False)
    result = "\n".join([s.text for s in segments])
    return JSONResponse({"text": result})

    


