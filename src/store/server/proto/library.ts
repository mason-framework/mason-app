/* eslint-disable */
import { Writer, Reader } from 'protobufjs/minimal';


export interface Port {
  name: string;
  type: string;
  direction: string;
  sequence: boolean;
  map: boolean;
  choices: string[];
  default: string;
}

export interface Node {
  group: string;
  name: string;
  ports: Port[];
  signals: string[];
  slots: string[];
}

export interface Blueprint {
  group: string;
  name: string;
  signals: string[];
  slots: string[];
}

export interface Library {
  nodes: Node[];
  blueprints: Blueprint[];
}

const basePort: object = {
  name: "",
  type: "",
  direction: "",
  sequence: false,
  map: false,
  choices: "",
  default: "",
};

const baseNode: object = {
  group: "",
  name: "",
  ports: undefined,
  signals: "",
  slots: "",
};

const baseBlueprint: object = {
  group: "",
  name: "",
  signals: "",
  slots: "",
};

const baseLibrary: object = {
  nodes: undefined,
  blueprints: undefined,
};

export const Port = {
  encode(message: Port, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(18).string(message.type);
    writer.uint32(26).string(message.direction);
    writer.uint32(32).bool(message.sequence);
    writer.uint32(40).bool(message.map);
    for (const v of message.choices) {
      writer.uint32(50).string(v!);
    }
    writer.uint32(58).string(message.default);
    return writer;
  },
  decode(reader: Reader, length?: number): Port {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(basePort) as Port;
    message.choices = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.type = reader.string();
          break;
        case 3:
          message.direction = reader.string();
          break;
        case 4:
          message.sequence = reader.bool();
          break;
        case 5:
          message.map = reader.bool();
          break;
        case 6:
          message.choices.push(reader.string());
          break;
        case 7:
          message.default = reader.string();
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
    message.choices = [];
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
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
    if (object.sequence !== undefined && object.sequence !== null) {
      message.sequence = Boolean(object.sequence);
    } else {
      message.sequence = false;
    }
    if (object.map !== undefined && object.map !== null) {
      message.map = Boolean(object.map);
    } else {
      message.map = false;
    }
    if (object.choices !== undefined && object.choices !== null) {
      for (const e of object.choices) {
        message.choices.push(String(e));
      }
    }
    if (object.default !== undefined && object.default !== null) {
      message.default = String(object.default);
    } else {
      message.default = "";
    }
    return message;
  },
  fromPartial(object: DeepPartial<Port>): Port {
    const message = Object.create(basePort) as Port;
    message.choices = [];
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
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
    if (object.sequence !== undefined && object.sequence !== null) {
      message.sequence = object.sequence;
    } else {
      message.sequence = false;
    }
    if (object.map !== undefined && object.map !== null) {
      message.map = object.map;
    } else {
      message.map = false;
    }
    if (object.choices !== undefined && object.choices !== null) {
      for (const e of object.choices) {
        message.choices.push(e);
      }
    }
    if (object.default !== undefined && object.default !== null) {
      message.default = object.default;
    } else {
      message.default = "";
    }
    return message;
  },
  toJSON(message: Port): unknown {
    const obj: any = {};
    obj.name = message.name || "";
    obj.type = message.type || "";
    obj.direction = message.direction || "";
    obj.sequence = message.sequence || false;
    obj.map = message.map || false;
    if (message.choices) {
      obj.choices = message.choices.map(e => e || "");
    } else {
      obj.choices = [];
    }
    obj.default = message.default || "";
    return obj;
  },
};

export const Node = {
  encode(message: Node, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.group);
    writer.uint32(18).string(message.name);
    for (const v of message.ports) {
      Port.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.signals) {
      writer.uint32(34).string(v!);
    }
    for (const v of message.slots) {
      writer.uint32(42).string(v!);
    }
    return writer;
  },
  decode(reader: Reader, length?: number): Node {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseNode) as Node;
    message.ports = [];
    message.signals = [];
    message.slots = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.group = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.ports.push(Port.decode(reader, reader.uint32()));
          break;
        case 4:
          message.signals.push(reader.string());
          break;
        case 5:
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
    message.signals = [];
    message.slots = [];
    if (object.group !== undefined && object.group !== null) {
      message.group = String(object.group);
    } else {
      message.group = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.ports !== undefined && object.ports !== null) {
      for (const e of object.ports) {
        message.ports.push(Port.fromJSON(e));
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
    message.signals = [];
    message.slots = [];
    if (object.group !== undefined && object.group !== null) {
      message.group = object.group;
    } else {
      message.group = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.ports !== undefined && object.ports !== null) {
      for (const e of object.ports) {
        message.ports.push(Port.fromPartial(e));
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
    obj.group = message.group || "";
    obj.name = message.name || "";
    if (message.ports) {
      obj.ports = message.ports.map(e => e ? Port.toJSON(e) : undefined);
    } else {
      obj.ports = [];
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
    writer.uint32(10).string(message.group);
    writer.uint32(18).string(message.name);
    for (const v of message.signals) {
      writer.uint32(34).string(v!);
    }
    for (const v of message.slots) {
      writer.uint32(42).string(v!);
    }
    return writer;
  },
  decode(reader: Reader, length?: number): Blueprint {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseBlueprint) as Blueprint;
    message.signals = [];
    message.slots = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.group = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 4:
          message.signals.push(reader.string());
          break;
        case 5:
          message.slots.push(reader.string());
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
    message.signals = [];
    message.slots = [];
    if (object.group !== undefined && object.group !== null) {
      message.group = String(object.group);
    } else {
      message.group = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
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
  fromPartial(object: DeepPartial<Blueprint>): Blueprint {
    const message = Object.create(baseBlueprint) as Blueprint;
    message.signals = [];
    message.slots = [];
    if (object.group !== undefined && object.group !== null) {
      message.group = object.group;
    } else {
      message.group = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
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
  toJSON(message: Blueprint): unknown {
    const obj: any = {};
    obj.group = message.group || "";
    obj.name = message.name || "";
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

export const Library = {
  encode(message: Library, writer: Writer = Writer.create()): Writer {
    for (const v of message.nodes) {
      Node.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.blueprints) {
      Blueprint.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): Library {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseLibrary) as Library;
    message.nodes = [];
    message.blueprints = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nodes.push(Node.decode(reader, reader.uint32()));
          break;
        case 2:
          message.blueprints.push(Blueprint.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Library {
    const message = Object.create(baseLibrary) as Library;
    message.nodes = [];
    message.blueprints = [];
    if (object.nodes !== undefined && object.nodes !== null) {
      for (const e of object.nodes) {
        message.nodes.push(Node.fromJSON(e));
      }
    }
    if (object.blueprints !== undefined && object.blueprints !== null) {
      for (const e of object.blueprints) {
        message.blueprints.push(Blueprint.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<Library>): Library {
    const message = Object.create(baseLibrary) as Library;
    message.nodes = [];
    message.blueprints = [];
    if (object.nodes !== undefined && object.nodes !== null) {
      for (const e of object.nodes) {
        message.nodes.push(Node.fromPartial(e));
      }
    }
    if (object.blueprints !== undefined && object.blueprints !== null) {
      for (const e of object.blueprints) {
        message.blueprints.push(Blueprint.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: Library): unknown {
    const obj: any = {};
    if (message.nodes) {
      obj.nodes = message.nodes.map(e => e ? Node.toJSON(e) : undefined);
    } else {
      obj.nodes = [];
    }
    if (message.blueprints) {
      obj.blueprints = message.blueprints.map(e => e ? Blueprint.toJSON(e) : undefined);
    } else {
      obj.blueprints = [];
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