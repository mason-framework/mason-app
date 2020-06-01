/* eslint-disable */
import { Writer, Reader } from 'protobufjs/minimal';


export interface Connection {
  source: string;
  target: string;
}

export interface Port {
  name: string;
  value: string;
  label: string;
  type: string;
  direction: string;
}

export interface Node {
  uid: string;
  label: string;
  type: string;
  ports: Port[];
  nodes: Node[];
  signals: string[];
  slots: string[];
}

export interface Blueprint {
  uid: string;
  label: string;
  type: string;
  nodes: Node[];
  connections: Connection[];
}

const baseConnection: object = {
  source: "",
  target: "",
};

const basePort: object = {
  name: "",
  value: "",
  label: "",
  type: "",
  direction: "",
};

const baseNode: object = {
  uid: "",
  label: "",
  type: "",
  ports: undefined,
  nodes: undefined,
  signals: "",
  slots: "",
};

const baseBlueprint: object = {
  uid: "",
  label: "",
  type: "",
  nodes: undefined,
  connections: undefined,
};

export const Connection = {
  encode(message: Connection, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.source);
    writer.uint32(18).string(message.target);
    return writer;
  },
  decode(reader: Reader, length?: number): Connection {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseConnection) as Connection;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.source = reader.string();
          break;
        case 2:
          message.target = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Connection {
    const message = Object.create(baseConnection) as Connection;
    if (object.source !== undefined && object.source !== null) {
      message.source = String(object.source);
    } else {
      message.source = "";
    }
    if (object.target !== undefined && object.target !== null) {
      message.target = String(object.target);
    } else {
      message.target = "";
    }
    return message;
  },
  fromPartial(object: DeepPartial<Connection>): Connection {
    const message = Object.create(baseConnection) as Connection;
    if (object.source !== undefined && object.source !== null) {
      message.source = object.source;
    } else {
      message.source = "";
    }
    if (object.target !== undefined && object.target !== null) {
      message.target = object.target;
    } else {
      message.target = "";
    }
    return message;
  },
  toJSON(message: Connection): unknown {
    const obj: any = {};
    obj.source = message.source || "";
    obj.target = message.target || "";
    return obj;
  },
};

export const Port = {
  encode(message: Port, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(18).string(message.value);
    writer.uint32(26).string(message.label);
    writer.uint32(34).string(message.type);
    writer.uint32(42).string(message.direction);
    return writer;
  },
  decode(reader: Reader, length?: number): Port {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(basePort) as Port;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        case 3:
          message.label = reader.string();
          break;
        case 4:
          message.type = reader.string();
          break;
        case 5:
          message.direction = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Port {
    const message = Object.create(basePort) as Port;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = String(object.value);
    } else {
      message.value = "";
    }
    if (object.label !== undefined && object.label !== null) {
      message.label = String(object.label);
    } else {
      message.label = "";
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = "";
    }
    if (object.direction !== undefined && object.direction !== null) {
      message.direction = String(object.direction);
    } else {
      message.direction = "";
    }
    return message;
  },
  fromPartial(object: DeepPartial<Port>): Port {
    const message = Object.create(basePort) as Port;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value;
    } else {
      message.value = "";
    }
    if (object.label !== undefined && object.label !== null) {
      message.label = object.label;
    } else {
      message.label = "";
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = "";
    }
    if (object.direction !== undefined && object.direction !== null) {
      message.direction = object.direction;
    } else {
      message.direction = "";
    }
    return message;
  },
  toJSON(message: Port): unknown {
    const obj: any = {};
    obj.name = message.name || "";
    obj.value = message.value || "";
    obj.label = message.label || "";
    obj.type = message.type || "";
    obj.direction = message.direction || "";
    return obj;
  },
};

export const Node = {
  encode(message: Node, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.uid);
    writer.uint32(18).string(message.label);
    writer.uint32(26).string(message.type);
    for (const v of message.ports) {
      Port.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.nodes) {
      Node.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.signals) {
      writer.uint32(50).string(v!);
    }
    for (const v of message.slots) {
      writer.uint32(58).string(v!);
    }
    return writer;
  },
  decode(reader: Reader, length?: number): Node {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseNode) as Node;
    message.ports = [];
    message.nodes = [];
    message.signals = [];
    message.slots = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.uid = reader.string();
          break;
        case 2:
          message.label = reader.string();
          break;
        case 3:
          message.type = reader.string();
          break;
        case 4:
          message.ports.push(Port.decode(reader, reader.uint32()));
          break;
        case 5:
          message.nodes.push(Node.decode(reader, reader.uint32()));
          break;
        case 6:
          message.signals.push(reader.string());
          break;
        case 7:
          message.slots.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Node {
    const message = Object.create(baseNode) as Node;
    message.ports = [];
    message.nodes = [];
    message.signals = [];
    message.slots = [];
    if (object.uid !== undefined && object.uid !== null) {
      message.uid = String(object.uid);
    } else {
      message.uid = "";
    }
    if (object.label !== undefined && object.label !== null) {
      message.label = String(object.label);
    } else {
      message.label = "";
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = "";
    }
    if (object.ports !== undefined && object.ports !== null) {
      for (const e of object.ports) {
        message.ports.push(Port.fromJSON(e));
      }
    }
    if (object.nodes !== undefined && object.nodes !== null) {
      for (const e of object.nodes) {
        message.nodes.push(Node.fromJSON(e));
      }
    }
    if (object.signals !== undefined && object.signals !== null) {
      for (const e of object.signals) {
        message.signals.push(String(e));
      }
    }
    if (object.slots !== undefined && object.slots !== null) {
      for (const e of object.slots) {
        message.slots.push(String(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<Node>): Node {
    const message = Object.create(baseNode) as Node;
    message.ports = [];
    message.nodes = [];
    message.signals = [];
    message.slots = [];
    if (object.uid !== undefined && object.uid !== null) {
      message.uid = object.uid;
    } else {
      message.uid = "";
    }
    if (object.label !== undefined && object.label !== null) {
      message.label = object.label;
    } else {
      message.label = "";
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = "";
    }
    if (object.ports !== undefined && object.ports !== null) {
      for (const e of object.ports) {
        message.ports.push(Port.fromPartial(e));
      }
    }
    if (object.nodes !== undefined && object.nodes !== null) {
      for (const e of object.nodes) {
        message.nodes.push(Node.fromPartial(e));
      }
    }
    if (object.signals !== undefined && object.signals !== null) {
      for (const e of object.signals) {
        message.signals.push(e);
      }
    }
    if (object.slots !== undefined && object.slots !== null) {
      for (const e of object.slots) {
        message.slots.push(e);
      }
    }
    return message;
  },
  toJSON(message: Node): unknown {
    const obj: any = {};
    obj.uid = message.uid || "";
    obj.label = message.label || "";
    obj.type = message.type || "";
    if (message.ports) {
      obj.ports = message.ports.map(e => e ? Port.toJSON(e) : undefined);
    } else {
      obj.ports = [];
    }
    if (message.nodes) {
      obj.nodes = message.nodes.map(e => e ? Node.toJSON(e) : undefined);
    } else {
      obj.nodes = [];
    }
    if (message.signals) {
      obj.signals = message.signals.map(e => e || "");
    } else {
      obj.signals = [];
    }
    if (message.slots) {
      obj.slots = message.slots.map(e => e || "");
    } else {
      obj.slots = [];
    }
    return obj;
  },
};

export const Blueprint = {
  encode(message: Blueprint, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.uid);
    writer.uint32(18).string(message.label);
    writer.uint32(26).string(message.type);
    for (const v of message.nodes) {
      Node.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.connections) {
      Connection.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): Blueprint {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseBlueprint) as Blueprint;
    message.nodes = [];
    message.connections = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.uid = reader.string();
          break;
        case 2:
          message.label = reader.string();
          break;
        case 3:
          message.type = reader.string();
          break;
        case 4:
          message.nodes.push(Node.decode(reader, reader.uint32()));
          break;
        case 5:
          message.connections.push(Connection.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Blueprint {
    const message = Object.create(baseBlueprint) as Blueprint;
    message.nodes = [];
    message.connections = [];
    if (object.uid !== undefined && object.uid !== null) {
      message.uid = String(object.uid);
    } else {
      message.uid = "";
    }
    if (object.label !== undefined && object.label !== null) {
      message.label = String(object.label);
    } else {
      message.label = "";
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = "";
    }
    if (object.nodes !== undefined && object.nodes !== null) {
      for (const e of object.nodes) {
        message.nodes.push(Node.fromJSON(e));
      }
    }
    if (object.connections !== undefined && object.connections !== null) {
      for (const e of object.connections) {
        message.connections.push(Connection.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<Blueprint>): Blueprint {
    const message = Object.create(baseBlueprint) as Blueprint;
    message.nodes = [];
    message.connections = [];
    if (object.uid !== undefined && object.uid !== null) {
      message.uid = object.uid;
    } else {
      message.uid = "";
    }
    if (object.label !== undefined && object.label !== null) {
      message.label = object.label;
    } else {
      message.label = "";
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = "";
    }
    if (object.nodes !== undefined && object.nodes !== null) {
      for (const e of object.nodes) {
        message.nodes.push(Node.fromPartial(e));
      }
    }
    if (object.connections !== undefined && object.connections !== null) {
      for (const e of object.connections) {
        message.connections.push(Connection.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: Blueprint): unknown {
    const obj: any = {};
    obj.uid = message.uid || "";
    obj.label = message.label || "";
    obj.type = message.type || "";
    if (message.nodes) {
      obj.nodes = message.nodes.map(e => e ? Node.toJSON(e) : undefined);
    } else {
      obj.nodes = [];
    }
    if (message.connections) {
      obj.connections = message.connections.map(e => e ? Connection.toJSON(e) : undefined);
    } else {
      obj.connections = [];
    }
    return obj;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | undefined;
type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;