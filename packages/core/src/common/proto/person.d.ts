import * as $protobuf from "protobufjs";
import Long = require("long");
/** Properties of a Person. */
export interface IPerson {

    /** Person name */
    name?: (string|null);

    /** Person id */
    id?: (number|null);

    /** Person email */
    email?: (string|null);
}

/** Represents a Person. */
export class Person implements IPerson {

    /**
     * Constructs a new Person.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPerson);

    /** Person name. */
    public name: string;

    /** Person id. */
    public id: number;

    /** Person email. */
    public email: string;

    /**
     * Creates a new Person instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Person instance
     */
    public static create(properties?: IPerson): Person;

    /**
     * Encodes the specified Person message. Does not implicitly {@link Person.verify|verify} messages.
     * @param message Person message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPerson, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Person message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Person
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Person;

    /**
     * Creates a Person message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Person
     */
    public static fromObject(object: { [k: string]: any }): Person;

    /**
     * Creates a plain object from a Person message. Also converts values to other types if specified.
     * @param message Person
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Person, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Person to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
