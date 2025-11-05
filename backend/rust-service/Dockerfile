FROM rust:1.90 as builder
WORKDIR /opt
COPY . .
RUN cargo build --release
RUN cp /opt/target/release/catalize .
RUN cargo clean

FROM ubuntu:24.04
RUN apt-get update \
    && apt-get install -y --no-install-recommends vim \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /opt
COPY --from=builder /opt/catalize .
EXPOSE 3000
CMD ["./catalize"]
