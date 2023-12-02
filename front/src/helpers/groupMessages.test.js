/* eslint-disable no-undef */
const Pack = require('./groupMessages');
const groupMessages = Pack.groupMessages;
const difference = Pack.MESSAGE_TIME_DIFFERENCE;


let id = 0;

function createMessage(createdAt, userId = 1, updatedAt = createdAt) {
  id++;
  createdAt = new Date(createdAt);
  updatedAt = new Date(updatedAt);
  return {
    messageId: id,
    chatId: 0,
    text: id+'',
    user: {userId},
    updatedAt: updatedAt,
    createdAt: createdAt,
  };
}

function createDate(date, time = 0) {
  return new Date(new Date(date).getTime() + time);
}

beforeEach(() => id = 0);

test('empty array', () => {
  expect(groupMessages([])).toStrictEqual([]);
});

test('1 message', () => {
  const msg = createMessage('2023-01-01T10:00:00');

  const grped = groupMessages([msg]);

  expect(grped).toHaveLength(1);
  expect(grped[0]).toHaveProperty('texts', ['1']);
});

test('2 messages in a row', () => {

  const msg1 = createMessage('2023-01-01T10:00:00');
  const msg2 = createMessage('2023-01-01T10:00:00');

  const grped = groupMessages([msg1, msg2]);

  expect(grped).toHaveLength(1);
  expect(grped[0]).toHaveProperty('texts', ['1', '2']);

});

test('1-1 messages in a row', () => {

  const msg1 = createMessage('2023-01-01T10:00:00', 1);
  const msg2 = createMessage('2023-01-01T10:00:00', 2);

  const grped = groupMessages([msg1, msg2]);

  expect(grped).toHaveLength(2);
  expect(grped[0]).toHaveProperty('texts', ['1']);
  expect(grped[1]).toHaveProperty('texts', ['2']);

});

test('2 messages small delay', () => {

  const msg1 = createMessage('2023-01-01T10:00:00');
  const msg2Date = createDate('2023-01-01T10:00:00', difference / 2);
  const msg2 = createMessage(msg2Date);

  const grped = groupMessages([msg1, msg2]);

  expect(grped).toHaveLength(1);
  expect(grped[0]).toHaveProperty('texts', ['1', '2']);

});

test('2 messages long delay', () => {

  const msg1 = createMessage('2023-01-01T10:00:00');
  const msg2Date = createDate('2023-01-01T10:00:00', difference+1);
  const msg2 = createMessage(msg2Date);

  const grped = groupMessages([msg1, msg2]);

  expect(grped).toHaveLength(2);
  expect(grped[0]).toHaveProperty('texts', ['1']);
  expect(grped[1]).toHaveProperty('texts', ['2']);

});

test('2-2 messages small delay', () => {

  const msg1 = createMessage('2023-01-01T10:00:00', 1);
  const msg2Date = createDate('2023-01-01T10:00:00', difference / 2);
  const msg2 = createMessage(msg2Date, 1);

  const msg3Date = createDate('2023-01-01T10:00:00', difference * 2);
  const msg3 = createMessage(msg3Date, 2);
  const msg4Date = createDate('2023-01-01T10:00:00', difference * 2 + difference / 2);
  const msg4 = createMessage(msg4Date, 2);

  const grped = groupMessages([msg1, msg2, msg3, msg4]);

  expect(grped).toHaveLength(2);
  expect(grped[0]).toHaveProperty('texts', ['1', '2']);
  expect(grped[0].user).toHaveProperty('userId', 1);
  expect(grped[1]).toHaveProperty('texts', ['3', '4']);
  expect(grped[1].user).toHaveProperty('userId', 2);

});