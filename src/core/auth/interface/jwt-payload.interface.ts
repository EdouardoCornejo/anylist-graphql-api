/**
 * Represents the payload of a JWT (JSON Web Token).
 */
export interface JwtPayload {
  /**
   * The ID associated with the JWT.
   */
  id: string;

  /**
   * The timestamp when the JWT was issued (in seconds).
   */
  iat: number;

  /**
   * The expiration timestamp of the JWT (in seconds).
   */
  exp: number;
}
