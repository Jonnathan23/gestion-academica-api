# Domain Structure: Attendance

## Entities

### `AttendanceSessionEntity`

Represents an attendance session for a student.

- `atSeId` (string): The unique identifier for the attendance session.
- `atSeStudentId` (string): The identifier of the student.
- `atSeTeacherId` (string | null): The identifier of the teacher who approved the session.
- `atSeSessionDate` (Date): The date of the session.
- `atSeEntryTime` (Date): The check-in time.
- `atSeExitTime` (Date | null): The check-out time.
- `atSeTotalMinutes` (number | null): Total minutes the student was present.
- `atSeStatus` (AttendanceSessionStatus): The current status of the session.

## DTOs

### `StartAttendanceSessionDto`

Data Transfer Object for starting an attendance session.

- `studentId` (string, required): The identifier of the student checking in.
- `entryTime` (Date, required): The time the student checked in.

### `EndAttendanceSessionDto`

Data Transfer Object for ending an attendance session.

- `sessionId` (string, required): The identifier of the session to end.
- `teacherId` (string, required): The identifier of the teacher ending the session.
- `exitTime` (Date, required): The time the student checked out.

## Interfaces

### `AttendanceSessionRepository`

Repository interface for managing attendance sessions.

- `closeOrphanSessions(): Promise<number>`
- `startSession(dto: StartAttendanceSessionDto): Promise<AttendanceSessionEntity>`
- `endSession(dto: EndAttendanceSessionDto): Promise<AttendanceSessionEntity>`
- `getStudentsAbsentForMoreThan(days: number): Promise<AbsentStudentProjection[]>`
