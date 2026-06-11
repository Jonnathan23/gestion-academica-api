# Domain Structure: Retention Alert

## Entities

### `RetentionAlertEntity`

Represents an alert for a student who is at risk of dropping out due to absences.

- `reAlId` (string): Unique identifier for the alert.
- `reAlStudentId` (string): The identifier of the student.
- `reAlUserId` (string | null): The identifier of the user who handled the alert.
- `reAlContactDate` (Date | null): Date when the student was contacted.
- `reAlHasResponded` (boolean): Whether the student responded to contact.
- `reAlDaysAbsent` (number): Number of days the student has been absent.
- `reAlIsJustified` (boolean): Whether the absence was justified.
- `reAlJustificationReason` (string | null): Reason provided for the absence.
- `reAlReturnDeadline` (Date | null): Expected date of return.
- `reAlObservations` (string): Any additional observations.
- `reAlStatus` (RetentionAlertStatus): The status of the alert.
- `reAlCreatedAt` (Date): When the alert was created.

## DTOs

_(No DTOs defined for this module)_

## Interfaces

### `RetentionAlertRepository`

Repository interface for managing retention alerts.

- `upsertAlert(studentId: string, daysAbsent: number): Promise<void>`
