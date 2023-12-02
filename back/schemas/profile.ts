import validatorF from 'validator';

const validator = validatorF.default;

export interface ProfileSchema {
  userId: number,
  nickname: string,
  email: string,
  description: string,
  avatar: null | string,
  createdAt: Date,
}

export interface ProfileShortSchema {
  userId: number,
  nickname: string,
  avatar: string,
}

export interface ProfileTokenSchema {
  userId: number,
}

interface ValidatableProfile {
  email?: string,
  nickname?: string,
  password?: string,
  description?: string,
}

const check = {
  email: (str: string) => {
    return str
    && validator.isEmail(str);
  },
  nickname: (str: string) => {
    return str
    && validator.isLength(str, {min: 4, max: 20})
    && validator.matches(str, /[a-zA-Z0-9$!?_=+-]/);
  },
  password: (str: string) => {
    return str
    && validator.isLength(str, {min: 8, max: 30});
  },
  description: (str: string) => {
    // eslint-disable-next-line eqeqeq
    return str != null
    && validator.isLength(str, {min: 0, max: 300});
  }
};

export function validateProfile(obj: ValidatableProfile) {
  const validationResult: ValidatableProfile = {};
  if ('email' in obj) {
    if (!check.email(obj.email))
      validationResult.email = 'Invalid email.';
  }
  if ('nickname' in obj) {
    if (!check.nickname(obj.nickname))
      validationResult.nickname = 'Nickname must be 4-20 symbols long and contain only latin letters, numbers or $, !, ?, _, -, =, + symbols.';
  }
  if ('password' in obj) {
    if (!check.password(obj.password))
      validationResult.password = 'Password must be 8-30 symbols long.';
  }
  if ('description' in obj) {
    if (!check.description(obj.description))
      validationResult.description = 'Description can be only 300 symbols long.';
  }

  return Object.keys(validationResult).length > 0 ? validationResult : null;
}

