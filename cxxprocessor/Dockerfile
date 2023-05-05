# Copyright 2018 Intel Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# -----------------------------------------------------------------------------

FROM ubuntu:xenial

RUN set -xe && \
    apt-get update && \
    apt-get install -y apt-utils && \
    apt-get install -y -q curl gnupg && \
    echo '#!/bin/sh' > /usr/sbin/policy-rc.d && \
    echo 'exit 101' >> /usr/sbin/policy-rc.d && \
    chmod +x /usr/sbin/policy-rc.d && \
    dpkg-divert --local --rename --add /sbin/initctl && \
    cp -a /usr/sbin/policy-rc.d /sbin/initctl && \
    sed -i 's/^exit.*/exit 0/' /sbin/initctl && \
    echo 'force-unsafe-io' > /etc/dpkg/dpkg.cfg.d/docker-apt-speedup && \
    echo 'DPkg::Post-Invoke { "rm -f /var/cache/apt/archives/*.deb /var/cache/apt/archives/partial/*.deb /var/cache/apt/*.bin || true"; };' > /etc/apt/apt.conf.d/docker-clean && \
    echo 'APT::Update::Post-Invoke { "rm -f /var/cache/apt/archives/*.deb /var/cache/apt/archives/partial/*.deb /var/cache/apt/*.bin || true"; };' >> /etc/apt/apt.conf.d/docker-clean && \
    echo 'Dir::Cache::pkgcache ""; Dir::Cache::srcpkgcache "";' >> /etc/apt/apt.conf.d/docker-clean && \
    echo 'Acquire::Languages "none";' > /etc/apt/apt.conf.d/docker-no-languages && \
    echo 'Acquire::GzipIndexes "true"; Acquire::CompressionTypes::Order:: "gz";' > /etc/apt/apt.conf.d/docker-gzip-indexes && \
    echo 'Apt::AutoRemove::SuggestsImportant "false";' > /etc/apt/apt.conf.d/docker-autoremove-suggests && \
    echo "deb http://repo.sawtooth.me/ubuntu/ci xenial universe" >> /etc/apt/sources.list && \
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 8AA7AF1F1091A5FD && \
    echo "deb http://repo.sawtooth.me/ubuntu/nightly xenial universe" >> /etc/apt/sources.list && \
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 44FC67F19B2466EA && \
    apt-get update && \
    apt-get install -y -q apt-transport-https build-essential ca-certificates cmake g++ inotify-tools libcrypto++-dev liblog4cxx-dev libtool libzmqpp-dev libssl-dev sawtooth-cxx-sdk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN \
 apt-get install -y -q --no-install-recommends \
    apt-utils \
 && apt-get install -y -q \
    apt-transport-https \
    build-essential \
    ca-certificates \
    cmake  \
    g++  \
    inotify-tools \
    libcrypto++-dev \
    liblog4cxx-dev \
    libtool \
    libzmqpp-dev \
    libssl-dev \
    sawtooth-cxx-sdk \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

RUN apt-get update
RUN apt-get install -y git




# Clone RapidJSON repository
RUN git clone https://github.com/Tencent/rapidjson.git /rapidjson

# Build and install RapidJSON
RUN cd /rapidjson && \
    mkdir build && \
    cd build && \
    cmake .. && \
    make && \
    make install

COPY build.sh /project/cityinfo/cxxprocessor/

EXPOSE 4004/tcp

WORKDIR /project/cityinfo/cxxprocessor

CMD bash -c "./build.sh"
