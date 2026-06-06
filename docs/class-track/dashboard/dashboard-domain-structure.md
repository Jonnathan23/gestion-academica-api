# Domain Structure: Dashboard

## Entities

*(No specific entities for Dashboard as it acts as an Aggregator / Read Model reusing the Attendance module)*

## DTOs

*(No specific DTOs for the Dashboard API endpoint)*

## Projections

### `DashboardSummaryProjection`

Represents the overall dashboard summary containing aggregated metrics and the list of students currently in class.

- `studentsInsideCount` (number): The total number of students currently with an IN_PROGRESS session.
- `pendingCheckoutsCount` (number): The total number of sessions awaiting approval (PENDING_APPROVAL).
- `activeAlertsCount` (number): The total number of students who have been absent for more than 3 days.
- `activeContractsCount` (number): The total number of active student contracts (modules).
- `studentsInClass` (StudentInClassProjection[]): An array containing the details of students currently in class.

### `StudentInClassProjection`

Represents the details of a specific student currently attending a class session.

- `sessionId` (string): The unique identifier of the attendance session.
- `studentId` (string): The unique identifier of the student.
- `fullName` (string): The full name of the student.
- `contractStatus` (StudentContractStatus): The active status of the student's contract.
- `entryTime` (Date): The date and time when the student checked in.

## Interfaces

*(The Dashboard leverages repositories from the Attendance module)*
