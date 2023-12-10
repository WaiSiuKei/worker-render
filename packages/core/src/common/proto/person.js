/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Person = $root.Person = (() => {

    /**
     * Properties of a Person.
     * @exports IPerson
     * @interface IPerson
     * @property {string|null} [name] Person name
     * @property {number|null} [id] Person id
     * @property {string|null} [email] Person email
     */

    /**
     * Constructs a new Person.
     * @exports Person
     * @classdesc Represents a Person.
     * @implements IPerson
     * @constructor
     * @param {IPerson=} [properties] Properties to set
     */
    function Person(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Person name.
     * @member {string} name
     * @memberof Person
     * @instance
     */
    Person.prototype.name = "";

    /**
     * Person id.
     * @member {number} id
     * @memberof Person
     * @instance
     */
    Person.prototype.id = 0;

    /**
     * Person email.
     * @member {string} email
     * @memberof Person
     * @instance
     */
    Person.prototype.email = "";

    /**
     * Creates a new Person instance using the specified properties.
     * @function create
     * @memberof Person
     * @static
     * @param {IPerson=} [properties] Properties to set
     * @returns {Person} Person instance
     */
    Person.create = function create(properties) {
        return new Person(properties);
    };

    /**
     * Encodes the specified Person message. Does not implicitly {@link Person.verify|verify} messages.
     * @function encode
     * @memberof Person
     * @static
     * @param {IPerson} message Person message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Person.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.id);
        if (message.email != null && Object.hasOwnProperty.call(message, "email"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.email);
        return writer;
    };

    /**
     * Decodes a Person message from the specified reader or buffer.
     * @function decode
     * @memberof Person
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Person} Person
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Person.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Person();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.name = reader.string();
                    break;
                }
            case 2: {
                    message.id = reader.int32();
                    break;
                }
            case 3: {
                    message.email = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Creates a Person message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Person
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Person} Person
     */
    Person.fromObject = function fromObject(object) {
        if (object instanceof $root.Person)
            return object;
        let message = new $root.Person();
        if (object.name != null)
            message.name = String(object.name);
        if (object.id != null)
            message.id = object.id | 0;
        if (object.email != null)
            message.email = String(object.email);
        return message;
    };

    /**
     * Creates a plain object from a Person message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Person
     * @static
     * @param {Person} message Person
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Person.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.name = "";
            object.id = 0;
            object.email = "";
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.email != null && message.hasOwnProperty("email"))
            object.email = message.email;
        return object;
    };

    /**
     * Converts this Person to JSON.
     * @function toJSON
     * @memberof Person
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Person.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Person;
})();

export { $root as default };
