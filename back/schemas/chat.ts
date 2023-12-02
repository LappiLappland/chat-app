import validatorF from 'validator';

const validator = validatorF.default;

export interface ChatSchema {
  chatId: number,
  userId: number,
  title: string,
  avatar: null | string,
  createdAt: Date,
}

interface ValidatableChat {
  title?: string,
  password?: string,
}

const check = {
  title: (str: string) => {
    return str 
    && validator.isLength(str, {min: 4, max: 30})
    && validator.matches(str, /[a-zA-Z0-9$!?_=+-]/);
  },
  password: (str: string) => {
    return !str
    || validator.isLength(str, {min: 0, max: 30});
  },
};

export function validateChat(obj: ValidatableChat) {
  const validationResult: ValidatableChat = {};
  if ('title' in obj) {
    if (!check.title(obj.title))
      validationResult.title = 'Title must be 4-30 symbols long and contain only latin letters, numbers or $, !, ?, _, -, =, + symbols.';
  }
  if ('password' in obj) {
    if (!check.password(obj.password))
      validationResult.password = 'Password can be only 30 symbols long.';
  }

  return Object.keys(validationResult).length > 0 ? validationResult : null;
}

