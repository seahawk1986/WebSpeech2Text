import asyncio
import json
import tempfile
import ssl
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI()
ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain('cert.pem', keyfile='key.pem')
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def get_root():
    return RedirectResponse("static/index.html")
    return "It works!"

@app.post("/upload_audio")
async def process_audio(audio: UploadFile):
    with tempfile.NamedTemporaryFile() as audio_file:
        result_file = Path(f"{audio_file.name}.json")
        audio_file.write(await audio.read())
        proc = await asyncio.create_subprocess_exec(
            'whisper-ctranslate2',
            '--device', 'cpu',
            '--output_format', 'json',
            '--output_dir', '/tmp',
            '--language', 'de',
            '--task', 'transcribe',
            audio_file.name,
            stdout=asyncio.subprocess.PIPE
        )
        await proc.wait()
        return JSONResponse(json.loads(result_file.read_text()))

    


