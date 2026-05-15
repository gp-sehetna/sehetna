FROM python:3.12-slim

WORKDIR /ai-server-app

COPY pyproject.toml uv.lock ./

RUN pip install uv && uv sync

COPY . .

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
