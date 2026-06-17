# Domain Structure: Identity Verification (Verify)

## Entities

_No entities exist for this module as it strictly validates JWT sessions without querying the database layer._

## DTOs

_No DTOs are required for these requests since no data is sent in the body, queries, or params._

## Interfaces

_No data sources or repositories exist for this module as it does not persist data._

## Payloads (Returned in responses)

### `UserTokenPayload`

Payload of a validated standard user session.

- `id` (string): The unique identifier of the user.
- `email` (string): The user's email address.
- `role` (string): The user's assigned role.

### `StudentTokenPayload`

Payload of a validated ephemeral student session.

- `id` (string): The unique identifier of the student.
- `sessionId` (string): The unique identifier of the active attendance session.
- `role` (ClientRoles): The role assigned to the student (e.g., "STUDENT").
