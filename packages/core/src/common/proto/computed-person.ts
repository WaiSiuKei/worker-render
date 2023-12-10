import { Reader, Writer } from 'protobufjs/minimal';
import { NOTREACHED } from '../../base/common/notreached';

export class ComputedPerson {
  reader: Reader;
  writer: Writer;
  constructor(private buffer: Uint8Array) {
    this.reader = Reader.create(this.buffer);
    this.writer = Writer.create();
  }
  get name(): string {
    let end = this.reader.len;
    this.reader.pos = 0;
    while (this.reader.pos < end) {
      let tag = this.reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          return this.reader.string();
        }
        case 2: {
          this.reader.int32();
          break;
        }
        case 3: {
          this.reader.string();
          break;
        }
        default:
          this.reader.skipType(tag & 7);
          break;
      }
    }
    NOTREACHED();
  }
  set name(val: string) {
    console.log('write', val)
    this.writer.uint32(/* id 1, wireType 2 =*/10).string(val);
    // if (message.name != null && Object.hasOwnProperty.call(message, "name"))
    // if (message.id != null && Object.hasOwnProperty.call(message, "id"))
    //   writer.uint32(/* id 2, wireType 0 =*/16).int32(message.id);
    // if (message.email != null && Object.hasOwnProperty.call(message, "email"))
    //   writer.uint32(/* id 3, wireType 2 =*/26).string(message.email);
    this.buffer.set(this.writer.finish(), 0)
  }
}
