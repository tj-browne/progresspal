# Frontend Build Stage
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Backend Build Stage
FROM python:3.10-slim AS backend
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY --from=frontend-build /app/frontend/build /app/frontend/build

# Final Stage
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:${PORT}", "progresspal.wsgi:application"]
