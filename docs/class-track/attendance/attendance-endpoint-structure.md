# Endpoint Structure: Attendance

## `POST /api/attendance/check-in`

- **Description**: Starts an attendance session for a student.
- **Body**: `StartAttendanceSessionDto`
- **Response**: `SuccessResponse<AttendanceSessionEntity>`

## `PATCH /api/attendance/check-out`

- **Description**: Ends an attendance session for a student.
- **Body**: `EndAttendanceSessionDto`
- **Response**: `SuccessResponse<AttendanceSessionEntity>`

## `PATCH /api/attendance/approve`

- **Description**: Approves a pending attendance session.
- **Authorization**: Requires JWT Token.
- **Permissions Required**: `CLASSTRACK_ATTENDANCE_WRITE`
- **Body**: `ApproveAttendanceSessionDto`
- **Response**: `SuccessResponse<AttendanceSessionEntity>`

## `GET /api/attendance/in-progress`

- **Description**: Retrieves active sessions that are currently in progress.
- **Authorization**: Requires JWT Token.
- **Permissions Required**: `CLASSTRACK_ATTENDANCE_READ`
- **Response**: `SuccessResponse<StudentInClassProjection[]>`

## `GET /api/attendance/pending-approval`

- **Description**: Retrieves active sessions that are pending approval.
- **Authorization**: Requires JWT Token.
- **Permissions Required**: `CLASSTRACK_ATTENDANCE_READ`
- **Response**: `SuccessResponse<StudentInClassProjection[]>`

## `GET /api/attendance/completed`

- **Description**: Retrieves active sessions that have been completed (approved).
- **Authorization**: Requires JWT Token.
- **Permissions Required**: `CLASSTRACK_ATTENDANCE_READ`
- **Response**: `SuccessResponse<StudentInClassProjection[]>`
