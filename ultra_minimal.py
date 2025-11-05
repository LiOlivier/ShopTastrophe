from fastapi import FastAPI

app = FastAPI(title="Test Ultra Minimal")

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/test")
def test():
    return {"test": "ok"}