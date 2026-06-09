# Endpoint Structure: Students (Class Track)

## `GET /class-track/students/search`

- **Description**: Searches for students by matching a given search term against their full name or identification card. This endpoint is paginated/limited and returns a projection specifically tailored for the Class Track context.
- **Query**:
    - `searchTerm` (string): The term to search for (required, minimum 2 characters).
    - `limit` (number): Optional maximum number of results to return (default 10, max 50).
- **Body**: None
- **Response**: `SuccessResponse<StudentClassTrackProjection[]>`
