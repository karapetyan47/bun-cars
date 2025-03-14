import * as jose from 'jose';

class Jwt {
  static async generateToken(payload: jose.JWTPayload): Promise<string> {
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(Bun.env.JWT_SECRET));
  }

  static async verifyToken(token: string): Promise<any> {
    return await jose.jwtVerify(
      token,
      new TextEncoder().encode(Bun.env.JWT_SECRET)
    );
  }
}

export default Jwt;
