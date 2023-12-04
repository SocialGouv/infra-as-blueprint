ARG ALPINE_VERSION=3

# renovate: datasource=node depName=node versioning=node
ARG NODE_VERSION=18

FROM alpine:$ALPINE_VERSION as downloader
RUN apk add --update curl ca-certificates

FROM downloader as download-kubectl
# renovate: datasource=github-tags depName=kubernetes/kubectl extractVersion=^kubernetes-(?<version>.+)$
ARG KUBECTL_VERSION=1.27.1
ENV KUBECTL_VERSION=$KUBECTL_VERSION
RUN curl --fail -sL https://dl.k8s.io/release/v${KUBECTL_VERSION}/bin/linux/amd64/kubectl > /usr/local/bin/kubectl \
  && chmod +x /usr/local/bin/kubectl

FROM node:$NODE_VERSION AS node
RUN mkdir /app && chown 1000:1000 /app
USER 1000
WORKDIR /app

FROM node AS build
COPY .yarnrc.yml yarn.lock ./
COPY --chown=1000:1000 .yarn .yarn
RUN yarn fetch

# prefetch node, see https://github.com/vercel/pkg/issues/292#issuecomment-401353635
RUN touch noop.js && \
  yarn pkg -t node18-linuxstatic-x64 noop.js --out=noop && rm -rf noop && \
  rm noop.js

COPY package.json index.js ./
COPY src src

RUN yarn postinstall
RUN yarn build

FROM scratch
ENTRYPOINT [ "/bin/infra-as-blueprint" ]
CMD [ "playbook" ]
ENV PATH=/bin
ENV HOME=/workspace
USER 1000
WORKDIR /workspace

COPY --from=downloader /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=node /etc/passwd /etc/passwd
COPY --from=node --chown=1000:1000 /tmp /tmp

COPY --from=download-kubectl /usr/local/bin/kubectl /bin/kubectl
COPY --from=build /app/dist-bin/infra-as-blueprint /bin/infra-as-blueprint