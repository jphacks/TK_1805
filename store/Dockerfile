FROM python:3-slim
LABEL MAINTAINER="KeisukeYamashita"

ADD . /app
WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["python", "/app/app.py"]