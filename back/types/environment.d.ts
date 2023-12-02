declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: string,
      SOCKET_PORT: string,
      BCRYPT_ROUNDS: string,
      PASSWORD_SALT: string,
      JWT_SALT: string,
      IMAGES_STORAGE: string,
    }
  }
}

export {};