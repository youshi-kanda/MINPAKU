FROM python:3.12-slim

WORKDIR /app

RUN pip install poetry

# Copy README.md first since it's needed for poetry install
COPY README.md ./
COPY pyproject.toml poetry.lock* ./

# Use --no-root to avoid installing the current project during dependency installation
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root

# Now copy the rest of the application
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
