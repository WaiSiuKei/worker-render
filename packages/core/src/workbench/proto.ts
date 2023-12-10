import { Person } from '../common/proto/person';

const p = Person.create();
p.name = 'abc';
p.id = 123;
p.email = 'p@example.com';
const buffer = Person.encode(Person.create({ name: 'abc' })).finish();

function pbSerialize() {
  Person.encode(p).finish();
}

function pbDeserialize() {

}

function jsonSerialize() {

}
function jsonDeserialize() {

}
