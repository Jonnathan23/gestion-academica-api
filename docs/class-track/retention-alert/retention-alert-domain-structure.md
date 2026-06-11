# Domain Structure: Retention Alerts

## Entities

### `RetentionAlertEntity`

Entity representing a retention alert in the system.

- `reAlId` (string): Unique identifier for the retention alert.
- `reAlStudentId` (string): Unique identifier of the associated student.
- `reAlUserId` (string | null): Unique identifier of the user (advisor) assigned to the alert.
- `reAlContactDate` (Date | null): The date when the student was contacted.
- `reAlHasResponded` (boolean): Indicates if the student has responded.
- `reAlDaysAbsent` (number): The number of days the student has been absent.
- `reAlIsJustified` (boolean): Indicates if the absence is justified.
- `reAlJustificationReason` (string | null): The reason for justification, if any.
- `reAlReturnDeadline` (Date | null): The deadline for the student to return.
- `reAlObservations` (string): Additional observations regarding the alert.
- `reAlStatus` (RetentionAlertStatus): The current status of the alert.
- `reAlCreatedAt` (Date): The date and time when the alert was created.

### `BasicStudentInfo`

Basic information of a student associated with a retention alert.

- `id` (string): Unique identifier for the student.
- `fullName` (string): The student's full name.
- `identificationCard` (string): The student's identification card number.
- `phoneNumber` (string): The student's phone number.
- `contractStatus` (string): The current contract status of the student.

### `RetentionAlertWithStudentProjection`

Projection combining a retention alert with basic student information.

- `id` (string): Unique identifier for the retention alert.
- `contactDate` (Date | null): The date when the student was contacted.
- `hasResponded` (boolean): Indicates if the student has responded.
- `daysAbsent` (number): The number of days the student has been absent.
- `isJustified` (boolean): Indicates if the absence is justified.
- `justificationReason` (string | null): The reason for justification, if any.
- `returnDeadline` (Date | null): The deadline for the student to return.
- `observations` (string): Additional observations regarding the alert.
- `status` (RetentionAlertStatus): The current status of the alert.
- `student` (BasicStudentInfo): The basic information of the associated student.
- `createdAt` (Date): The date and time when the alert was created.

## DTOs

### `GetRetentionAlertsDto`

Data transfer object for querying retention alerts.

- `status` (RetentionAlertStatus, optional): Filter alerts by their current status.
- `page` (number, optional): The page number for pagination. Defaults to 1.
- `limit` (number, optional): The number of records per page. Defaults to 10.

### `UpdateRetentionAlertDto`

Data transfer object for updating a retention alert's general information.

- `hasResponded` (boolean, required): Indicates if the student has responded.
- `isJustified` (boolean, required): Indicates if the absence is justified.
- `observations` (string, required): Additional observations.
- `contactDate` (Date, optional): The date when the student was contacted.
- `justificationReason` (string, optional): The reason for justification. Required if `isJustified` is true.
- `returnDeadline` (Date, optional): The deadline for the student to return.

### `ChangeRetentionAlertStatusDto`

Data transfer object for changing the status of a retention alert.

- `status` (RetentionAlertStatus, required): The new status for the retention alert.

## Interfaces

### `RetentionAlertDatasource` / `RetentionAlertRepository`

Repository interface for managing retention alerts persistence.

- `upsertAlert(studentId: string, daysAbsent: number): Promise<void>`
- `getAlerts(dto: GetRetentionAlertsDto): Promise<RetentionAlertWithStudentProjection[]>`
- `updateAlertInfo(id: string, dto: UpdateRetentionAlertDto): Promise<RetentionAlertEntity>`
- `changeAlertStatus(id: string, status: RetentionAlertStatus): Promise<RetentionAlertEntity>`
