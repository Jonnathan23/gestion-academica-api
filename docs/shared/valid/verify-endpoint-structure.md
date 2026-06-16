# Endpoint Structure: Identity Verification (Verify)

## `GET /api/verify/user`

- **Description**: Validates the standard user session (Teacher/Admin) using the JWT token (provided via `auth_token` cookie or `Authorization` header).
- **Params**: _None_
- **Query**: _None_
- **Body**: _None_
- **Response**: `SuccessResponse<UserTokenPayload>`
    - Returns HTTP 200 with the `UserTokenPayload` if the session is valid and active.
    - Throws HTTP 401 if the session is invalid, expired, or the user is deactivated.

## `GET /api/verify/student`

- **Description**: Validates the ephemeral student session using the JWT token (provided via `classTrackSession` cookie).
- **Params**: _None_
- **Query**: _None_
- **Body**: _None_
- **Response**: `SuccessResponse<StudentTokenPayload>`
    - Returns HTTP 200 with the `StudentTokenPayload` if the student session is valid and active.
    - Throws HTTP 401 if the student session is invalid or expired.
