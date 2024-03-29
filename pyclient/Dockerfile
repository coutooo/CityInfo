FROM ubuntu:bionic

ARG DEBIAN_FRONTEND=noninteractive

RUN \
 apt-get update \
 && apt-get install -y -q curl gnupg \
 && apt-get install -y gnupg2 \
 && apt-get install -y build-essential \
 && curl -sSL 'http://keyserver.ubuntu.com/pks/lookup?op=get&search=0x8AA7AF1F1091A5FD' | apt-key add -  \
 && echo 'deb [arch=amd64] http://repo.sawtooth.me/ubuntu/chime/stable bionic universe' >> /etc/apt/sources.list \
 && apt-get update

RUN \
 apt-get install -y -q --no-install-recommends \
    apt-utils \
 && apt-get install -y -q \
    apt-transport-https \
    build-essential \
    ca-certificates \
    inetutils-ping \
    libffi-dev \
    libssl-dev \
    python3-aiodns \
    python3-aiohttp \
    python3-aiopg \
    python3-async-timeout \
    python3-bitcoin \
    python3-cbor \
    python3-cchardet \
    python3-chardet \
    python3-colorlog \
    python3-cov-core \
    python3-cryptography-vectors \
    python3-cryptography \
    python3-dev \
    python3-grpcio-tools \
    python3-grpcio \
    python3-lmdb \
    python3-multidict \
    python3-netifaces \
    python3-nose2 \
    python3-pip \
    python3-protobuf \
    python3-psycopg2 \
    python3-pycares \
    python3-pyformance \
    python3-pytest-runner \
    python3-pytest \
    python3-pytz \
    python3-requests \
    python3-secp256k1 \
    python3-setuptools-scm \
    python3-six \
    python3-toml \
    python3-yaml \
    python3-yarl\
    python3-zmq \
    software-properties-common \
    python3-sawtooth-sdk \
    python3-sawtooth-cli \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*


COPY startapi.sh /project/cityinfo/pyclient/
COPY cityinfo_commands.py /project/cityinfo/pyclient/

WORKDIR /project/cityinfo/pyclient

ENV PATH "$PATH:/project/cityinfo/pyclient"

EXPOSE 3000
EXPOSE 8080

#RUN chmod +x startapi.sh

#CMD bash -c "./startapi.sh"

ENTRYPOINT ["bash", "-c", "sawtooth keygen --force sawtooth && python3 cityinfo_commands.py& tail -f /dev/null"]

CMD unset PYTHONPATH && python3 setup.py clean --all && python3 setup.py build 



