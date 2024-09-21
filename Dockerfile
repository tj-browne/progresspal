# Frontend Build Stage
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/ ./
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL $REACT_APP_API_BASE_URL
RUN npm install
RUN npm run build

# Backend Build Stage
FROM python:3.10-slim AS backend
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY --from=frontend-build /app/frontend/build ./frontend/build
RUN python manage.py collectstatic --noinput

# Final Stage
EXPOSE 8000
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8000} progresspal.wsgi:application"]
