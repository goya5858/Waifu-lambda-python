FROM public.ecr.aws/lambda/python:3.8

COPY . ${LAMBDA_TASK_ROOT}

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

# AWS credentials
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
    AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

# コンテナ内で必要なパッケージをインストール
RUN yum update -y && \
    yum install -y mesa-libGL && \
    python3.8 -m pip install -r requirements.txt -t .

EXPOSE 8000

CMD [ "lambda_function.lambda_handler" ]