FROM python:3.10-slim


WORKDIR /app
COPY /backend/ /app/
RUN pip3 install -r requirements.txt
RUN echo $PYTHONPATH


CMD ["python3", "main.py"]
