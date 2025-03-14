class Password {
  static async hash(password: string): Promise<string> {
    const salt = Number(Bun.env.PASSWORD_HASH_COST);
    return await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: salt,
    });
  }

  static async verify(password: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(password, hash);
  }
}

export default Password;
