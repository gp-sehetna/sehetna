FROM python:3.12-slim
WORKDIR /ai-server-app


RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*


RUN pip install --no-cache-dir uv
COPY pyproject.toml uv.lock ./


RUN uv sync
COPY . .


ENTRYPOINT ["uv", "run", "uvicorn", "main:app"]
CMD ["--host", "0.0.0.0", "--port", "8000"]
