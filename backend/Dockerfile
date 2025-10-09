# Python build stage
FROM python:3.10-slim-buster

ENV PYTHONUNBUFFERED 1

RUN apt-get update \
  && apt-get install -y nginx \
  # dependencies for building Python packages
  && apt-get install -y build-essential \
  && apt-get install -y libmariadbclient-dev \
  # psycopg2 dependencies
  && apt-get install -y libpq-dev \
  # Translations dependencies
  && apt-get install -y gettext \
  # cleaning up unused files
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y nginx

RUN addgroup --system django \
    && adduser --system --ingroup django django

# Requirements are installed here to ensure they will be cached.
COPY ./requirements /requirements
RUN pip install --no-cache-dir -r /requirements/production.txt \
    && rm -rf /requirements

COPY . /app

COPY --chown=django:django ./compose/production/django/start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

COPY --chown=django:django ./compose/production/django/celery/beat/start /start-celerybeat
RUN sed -i 's/\r$//g' /start-celerybeat
RUN chmod +x /start-celerybeat

COPY --chown=django:django ./compose/production/django/celery/worker/start /start-celeryworker
RUN sed -i 's/\r$//g' /start-celeryworker
RUN chmod +x /start-celeryworker

WORKDIR /app

COPY ./nginx/logo/favicon.ico .
COPY ./nginx/logo/logo.png .
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

CMD service nginx start && /start
