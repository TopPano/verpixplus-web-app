import randomstring from 'randomstring';

// let ids = [];

export default function genUUID() {
  const id = randomstring.generate({
    length: 20,
    charset: 'alphabetic'
  });

  // TODO: Duplicate id checking

  return id;
}
