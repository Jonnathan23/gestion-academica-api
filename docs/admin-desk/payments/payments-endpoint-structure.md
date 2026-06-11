# Endpoint Structure: Payments

## `POST /api/payments/student/:studentId/plan`

- **Description**: Crea un nuevo plan de pago financiero para un estudiante.
- **Params**:
    - `studentId` (string): UUID del estudiante.
- **Body**: `CreatePaymentPlanDto`
- **Response**: `SuccessResponse<PaymentPlanEntity>`

## `GET /api/payments/student/:studentId`

- **Description**: Obtiene el historial u estado financiero general (planes de pago) de un estudiante.
- **Params**:
    - `studentId` (string): UUID del estudiante.
- **Response**: `SuccessResponse<PaymentPlanEntity[]>`

## `PATCH /api/payments/quota/:quotaId/pay`

- **Description**: Procesa el abono o el pago completo de una cuota de estudiante.
- **Params**:
    - `quotaId` (string): UUID de la cuota.
- **Body**: `PayQuotaDto`
- **Response**: `SuccessResponse<PaymentQuotaEntity>`

## `POST /api/payments/quota/:quotaId/revert`

- **Description**: Anula un pago realizado a una cuota (generalmente en caso de un error humano).
- **Params**:
    - `quotaId` (string): UUID de la cuota a anular.
- **Response**: `SuccessResponse<null>`
