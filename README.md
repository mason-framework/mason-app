# Mason App

Frontend editor for mason framework.

# Generating Protobufs

```bash
$ cd ..
$ git clone mason-framework
$ cd mason-framework
$ $PROTOC -I=./mason/proto/ --ts_proto_out=../mason-app/src/store/mason/proto/ --plugin=../mason-app/node_modules/ts-proto/protoc-gen-ts_proto ./mason/proto/library.proto
```
