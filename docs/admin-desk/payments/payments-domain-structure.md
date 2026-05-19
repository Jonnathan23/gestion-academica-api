# Domain Structure: Payments

## Entities

### `PaymentPlanEntity`

Clase principal del dominio para los planes de pago de un estudiante.

- `id` (string): Identificador único.
- `studentId` (string): Identificador del estudiante asociado.
- `sellerId` (string): Identificador del vendedor.
- `enrollmentFee` (number): Cuota o tarifa de inscripción.
- `totalAmount` (number): Monto total del plan de pago.
- `isSinglePayment` (boolean): Bandera para indicar si es un pago único.
- `status` (string): Estado actual del plan.
- `quotas` (PaymentQuotaEntity[], optional): Arreglo de cuotas generadas y asociadas al plan.
- `createdAt` (Date, optional): Fecha de creación del registro.
- `updatedAt` (Date, optional): Fecha de la última actualización.

### `PaymentQuotaEntity`

Clase que representa una cuota individual de un plan de pago.

- `id` (string): Identificador único de la cuota.
- `paymentPlanId` (string): Identificador del plan principal al que pertenece la cuota.
- `quotaNumber` (number): Número correlativo de la cuota.
- `paymentMethod` (string | null): Método de pago utilizado (ej. efectivo, tarjeta, transferencia).
- `baseAmount` (number): Monto base esperado para la cuota.
- `rolloverDebt` (number): Deuda acumulada de cuotas anteriores.
- `totalExpected` (number): Total esperado a pagar en esta cuota.
- `amountPaid` (number): Monto efectivamente pagado.
- `dueDate` (Date): Fecha máxima de pago (vencimiento).
- `status` (string): Estado actual de la cuota.
- `createdAt` (Date, optional): Fecha de creación del registro.
- `updatedAt` (Date, optional): Fecha de la última actualización.

## DTOs

### `CreatePaymentPlanDto`

Objeto de transferencia para crear un plan de pago.

- `studentId` (string, required): Identificador del estudiante.
- `sellerId` (string, required): Identificador del vendedor.
- `enrollmentFee` (number, required): Cuota de inscripción.
- `totalAmount` (number, required): Monto total del plan.
- `isSinglePayment` (boolean, required): Bandera de pago único.
- `numberOfQuotas` (number, required): Cantidad de cuotas.
- `firstQuotaDueDate` (Date, required): Fecha de vencimiento de la primera cuota.

### `PayQuotaDto`

Objeto de transferencia para registrar el pago de una cuota.

- `quotaId` (string, required): Identificador de la cuota que se va a pagar.
- `amountPaid` (number, required): Cantidad que se abona.
- `paymentMethod` (PaymentMethod, required): Método utilizado (CASH, TRANSFER, CreditCard, MIXED).

## Interfaces

### Estados y Constantes (`paymentPlanStatus`)

Valores contantes para determinar el estado del plan de pago (PENDING, COMPLETED, CANCELLED). Existen constantes similares para los métodos de pago y estado de las cuotas.

### `PaymentDataSource` / `PaymentRepository`

Contrato para la capa de persistencia y acceso a datos financieros.

- `createPaymentPlan(dto: CreatePaymentPlanDto, generatedQuotas: PaymentQuotaEntity[]): Promise<PaymentPlanEntity>`
- `getStudentPaymentPlans(studentId: string): Promise<PaymentPlanEntity[]>`
- `processQuotaPayment(dto: PayQuotaDto): Promise<PaymentQuotaEntity>`
- `revertQuotaPayment(quotaId: string): Promise<boolean>`
