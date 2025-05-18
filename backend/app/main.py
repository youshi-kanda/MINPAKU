from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.properties import router as properties_router
from app.api.revenue import router as revenue_router
from app.api.line import router as line_router
from app.api.auth import router as auth_router

app = FastAPI(title="スマート民泊セールス・スイート API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://minpaku-sales-app-tunnel-kbyvi943.devinapps.com",  # Frontend origin
        "https://minpaku-sales-app-tunnel-5goozgjl.devinapps.com",  # Direct backend URL
        "https://minpaku-sales-app-tunnel-wu1zkdnr.devinapps.com",  # Current backend URL
        "https://minpaku-sales-app-tunnel-3ekpusjf.devinapps.com",  # New frontend origin
        "https://minpaku-sales-app-tunnel-v00h1col.devinapps.com",  # Latest frontend origin
        "https://minpaku-sales-app-tunnel-2ywdpno7.devinapps.com",  # Backend tunnel URL
        "https://minpaku-sales-app-tunnel-xqe71psj.devinapps.com",  # New frontend tunnel URL
        "http://localhost:3000",  # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth_router, prefix="/api")
app.include_router(properties_router, prefix="/api")
app.include_router(revenue_router, prefix="/api")
app.include_router(line_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "スマート民泊セールス・スイート API"}

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
