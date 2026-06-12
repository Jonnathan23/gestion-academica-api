# Endpoint Structure: Retention Alerts

## `GET /api/class-track/retention-alerts`

- **Description**: Fetches a paginated list of retention alerts along with their associated student information.
- **Query**: 
    - `status` (RetentionAlertStatus, optional): Filter the alerts by their current status.
    - `page` (number, optional): The page number for pagination.
    - `limit` (number, optional): The number of records to return per page.
- **Response**: `SuccessResponse<RetentionAlertWithStudentProjection[]>`

## `PATCH /api/class-track/retention-alerts/:id`

- **Description**: Updates the general information and tracking details of a specific retention alert.
- **Params**:
    - `id` (string): The unique identifier of the retention alert.
- **Body**: `UpdateRetentionAlertDto`
- **Response**: `SuccessResponse<RetentionAlertEntity>`

## `PATCH /api/class-track/retention-alerts/:id/status`

- **Description**: Changes the current status of a specific retention alert (e.g., from IN_PROGRESS to RESOLVED). Automatically sets the resolution date if the alert is resolved or closed.
- **Params**:
    - `id` (string): The unique identifier of the retention alert.
- **Body**: `ChangeRetentionAlertStatusDto`
- **Response**: `SuccessResponse<RetentionAlertEntity>`
