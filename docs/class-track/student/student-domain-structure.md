# Domain Structure: Students (Class Track)

## Entities / Projections

### `StudentClassTrackProjection`

Projection object representing a student in the Class Track module, optimized for fast read operations and searches.

- `studentId` (string): Unique identifier of the student.
- `identificationCard` (string): The identification card (ID) or document of the student.
- `fullName` (string): The full name of the student.

## DTOs

### `SearchStudentsDto`

Data Transfer Object used to encapsulate and validate the query parameters for searching students.

- `searchTerm` (string, required): The term to search for. It must be at least 2 characters long and is matched against the student's full name or identification card.
- `limit` (number, optional): The maximum number of students to return. Defaults to 10. Maximum allowed is 50.

## Interfaces

### `StudentDataSource` / `StudentRepository`

Abstract definitions for data access and persistence logic related to students in the Class Track module.

- `searchStudents(dto: SearchStudentsDto): Promise<StudentClassTrackProjection[]>`
