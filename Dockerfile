FROM node:22-bookworm-slim AS frontend
WORKDIR /app/frontend
RUN npm install --global pnpm@10.34.3
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
RUN pnpm build

FROM python:3.12-slim-bookworm
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/server.py ./
COPY --from=frontend /app/frontend/dist /app/frontend/dist
ENV FRONTEND_DIST=/app/frontend/dist COOKIE_SECURE=true
CMD ["sh", "-c", "FRONTEND_ORIGIN=\"${FRONTEND_ORIGIN:-$RENDER_EXTERNAL_URL}\" exec python -m uvicorn server:create_app --factory --host 0.0.0.0 --port \"${PORT:-10000}\" --workers 1"]
