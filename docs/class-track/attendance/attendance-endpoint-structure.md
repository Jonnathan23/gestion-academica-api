# Endpoint Structure: Attendance

## `POST /api/attendance/check-in`

- **Description**: Starts an attendance session for a student.
- **Body**: `StartAttendanceSessionDto`
- **Response**: `SuccessResponse<AttendanceSessionEntity>`

## `PATCH /api/attendance/check-out`

- **Description**: Ends an attendance session for a student.
- **Body**: `EndAttendanceSessionDto`
- **Response**: `SuccessResponse<AttendanceSessionEntity>`
