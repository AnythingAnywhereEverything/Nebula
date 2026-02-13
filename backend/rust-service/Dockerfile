FROM rust:1.90 as builder
WORKDIR /opt
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /opt

RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /opt/target/release/nebula .

EXPOSE 3000
CMD ["./nebula"]