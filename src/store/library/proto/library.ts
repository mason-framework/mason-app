/* eslint-disable */
import { Writer, Reader } from 'protobufjs/minimal';


export interface PortSchema {
  name: string;
  type: string;
  direction: string;
  sequence: boolean;
  map: boolean;
  choices: string[];
  default: string;
  visibility: string;
}

export interface NodeSchema {
  group: string;
  name: string;
  shape: string;
  defaultLabel: string;
  ports: PortSchema[];
  signals: string[];
  slots: string[];
}

export interface BlueprintSchema {
  group: string;
  name: string;
  signals: string[];
  slots: string[];
}

export interface Library {
  nodes: NodeSchema[];
  blueprints: BlueprintSchema[];
}

const basePortSchema: object = {
  name: "",
  type: "",
  direction: "",
  sequence: false,
  map: false,
  choices: "",
  default: "",
  visibility: "",
};

const baseNodeSchema: object = {
  group: "",
  name: "",
  shape: "",
  defaultLabel: "",
  ports: undefined,
  signals: "",
  slots: "",
};

const baseBlueprintSchema: object = {
  group: "",
  name: "",
  signals: "",
  slots: "",
};

const baseLibrary: object = {
  nodes: undefined,
  blueprints: undefined,
};

export const PortSchema = {
  encode(message: PortSchema, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(18).string(message.type);
    writer.uint32(26).string(message.direction);
    writer.uint32(32).bool(message.sequence);
    writer.uint32(40).bool(message.map);
    for (const v of message.choices) {
      writer.uint32(50).string(v!);
    }
    writer.uint32(58).string(message.default);
    writer.uint32(66).string(message.visibility);
    return writer;
  },
  decode(reader: Reader, length?: number): PortSchema {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(basePortSchema) as PortSchema;
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
        case 8:
          message.visibility = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PortSchema {
    const message = Object.create(basePortSchema) as PortSchema;
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
    if (object.visibility !== undefined && object.visibility !== null) {
      message.visibility = String(object.visibility);
    } else {
      message.visibility = "";
    }
    return message;
  },
  fromPartial(object: DeepPartial<PortSchema>): PortSchema {
    const message = Object.create(basePortSchema) as PortSchema;
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
    if (object.visibility !== undefined && object.visibility !== null) {
      message.visibility = object.visibility;
    } else {
      message.visibility = "";
    }
    return message;
  },
  toJSON(message: PortSchema): unknown {
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
    obj.visibility = message.visibility || "";
    return obj;
  },
};

export const NodeSchema = {
  encode(message: NodeSchema, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.group);
    writer.uint32(18).string(message.name);
    writer.uint32(26).string(message.shape);
    writer.uint32(34).string(message.defaultLabel);
    for (const v of message.ports) {
      PortSchema.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.signals) {
      writer.uint32(50).string(v!);
    }
    for (const v of message.slots) {
      writer.uint32(58).string(v!);
    }
    return writer;
  },
  decode(reader: Reader, length?: number): NodeSchema {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseNodeSchema) as NodeSchema;
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
          message.shape = reader.string();
          break;
        case 4:
          message.defaultLabel = reader.string();
          break;
        case 5:
          message.ports.push(PortSchema.decode(reader, reader.uint32()));
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
  fromJSON(object: any): NodeSchema {
    const message = Object.create(baseNodeSchema) as NodeSchema;
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
    if (object.shape !== undefined && object.shape !== null) {
      message.shape = String(object.shape);
    } else {
      message.shape = "";
    }
    if (object.defaultLabel !== undefined && object.defaultLabel !== null) {
      message.defaultLabel = String(object.defaultLabel);
    } else {
      message.defaultLabel = "";
    }
    if (object.ports !== undefined && object.ports !== null) {
      for (const e of object.ports) {
        message.ports.push(PortSchema.fromJSON(e));
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
  fromPartial(object: DeepPartial<NodeSchema>): NodeSchema {
    const message = Object.create(baseNodeSchema) as NodeSchema;
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
    if (object.shape !== undefined && object.shape !== null) {
      message.shape = object.shape;
    } else {
      message.shape = "";
    }
    if (object.defaultLabel !== undefined && object.defaultLabel !== null) {
      message.defaultLabel = object.defaultLabel;
    } else {
      message.defaultLabel = "";
    }
    if (object.ports !== undefined && object.ports !== null) {
      for (const e of object.ports) {
        message.ports.push(PortSchema.fromPartial(e));
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
  toJSON(message: NodeSchema): unknown {
    const obj: any = {};
    obj.group = message.group || "";
    obj.name = message.name || "";
    obj.shape = message.shape || "";
    obj.defaultLabel = message.defaultLabel || "";
    if (message.ports) {
      obj.ports = message.ports.map(e => e ? PortSchema.toJSON(e) : undefined);
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

export const BlueprintSchema = {
  encode(message: BlueprintSchema, writer: Writer = Writer.create()): Writer {
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
  decode(reader: Reader, length?: number): BlueprintSchema {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseBlueprintSchema) as BlueprintSchema;
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
  fromJSON(object: any): BlueprintSchema {
    const message = Object.create(baseBlueprintSchema) as BlueprintSchema;
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
  fromPartial(object: DeepPartial<BlueprintSchema>): BlueprintSchema {
    const message = Object.create(baseBlueprintSchema) as BlueprintSchema;
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
  toJSON(message: BlueprintSchema): unknown {
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
      NodeSchema.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.blueprints) {
      BlueprintSchema.encode(v!, writer.uint32(18).fork()).ldelim();
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
          message.nodes.push(NodeSchema.decode(reader, reader.uint32()));
          break;
        case 2:
          message.blueprints.push(BlueprintSchema.decode(reader, reader.uint32()));
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
        message.nodes.push(NodeSchema.fromJSON(e));
      }
    }
    if (object.blueprints !== undefined && object.blueprints !== null) {
      for (const e of object.blueprints) {
        message.blueprints.push(BlueprintSchema.fromJSON(e));
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
        message.nodes.push(NodeSchema.fromPartial(e));
      }
    }
    if (object.blueprints !== undefined && object.blueprints !== null) {
      for (const e of object.blueprints) {
        message.blueprints.push(BlueprintSchema.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: Library): unknown {
    const obj: any = {};
    if (message.nodes) {
      obj.nodes = message.nodes.map(e => e ? NodeSchema.toJSON(e) : undefined);
    } else {
      obj.nodes = [];
    }
    if (message.blueprints) {
      obj.blueprints = message.blueprints.map(e => e ? BlueprintSchema.toJSON(e) : undefined);
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