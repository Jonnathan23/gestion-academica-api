import { Op, type FindOptions, type WhereOptions } from "sequelize";
import RetentionAlert from "@/data/models/class-track/retention-alert.model";
import Student from "@/data/models/admin-desk/student.model";
import type { RetentionAlertDatasource } from "@/app/class-track/feats/retention-alerts/domain/datasource/retentionAlert.datasource";
import {
    retentionAlertStatus,
    type RetentionAlertStatus,
} from "@/app/class-track/feats/retention-alerts/domain/interfaces/retention-alert.interface";

import { CustomError } from "@/core/error/customError.error";
import type { RetentionAlertWithStudentProjection } from "@/app/class-track/feats/retention-alerts/domain/projections/RetentionAlertWithStudent.projection";
import type { GetRetentionAlertsDto } from "@/app/class-track/feats/retention-alerts/application/dtos/get-retention-alerts.dto";
import type { GetCountAlertsDto } from "@/app/class-track/feats/retention-alerts/application/dtos/get-count-alerts.dto";
import type { UpdateRetentionAlertDto } from "@/app/class-track/feats/retention-alerts/application/dtos/update-retention-alert.dto";
import type { RetentionAlertEntity } from "@/app/class-track/feats/retention-alerts/domain/entities/retention-alert.entity";
import { RetentionAlertWithStudentMapper } from "@/app/class-track/feats/retention-alerts/infrastructure/mappers/retention-alert-with-student.mapper";
import { RetentionAlertMapper } from "@/app/class-track/feats/retention-alerts/infrastructure/mappers/retention-alert.mapper";
import type { PaginatedResult } from "@/core/interfaces/paginated-result.interface";

export class RetentionAlertDatasourceImpl implements RetentionAlertDatasource {
    public async upsertAlert(studentId: string, daysAbsent: number): Promise<void> {
        const existingAlert = await RetentionAlert.findOne({
            where: {
                re_al_student_id: studentId,
                re_al_status: {
                    [Op.in]: [retentionAlertStatus.Pending, retentionAlertStatus.InProgress],
                },
            },
        });

        if (existingAlert) {
            await existingAlert.update({
                re_al_days_absent: daysAbsent,
            });
        } else {
            await RetentionAlert.create({
                re_al_student_id: studentId,
                re_al_contact_date: new Date(),
                re_al_days_absent: daysAbsent,
                re_al_observations: `Automated alert created for ${daysAbsent} days of absence.`,
                re_al_status: retentionAlertStatus.Pending,
                re_al_user_id: null, // Allow system to assign null initially
            });
        }
    }

    public async getCountAlerts(dto: GetCountAlertsDto): Promise<number> {
        return await RetentionAlert.count({
            where: {
                re_al_status: dto.status,
            },
        });
    }

    public async getAlerts(dto: GetRetentionAlertsDto): Promise<PaginatedResult<RetentionAlertWithStudentProjection>> {
        const queryOptions = this.buildGetAlertsQueryOptions(dto);
        const { rows, count } = await RetentionAlert.findAndCountAll(queryOptions);

        const limit = dto.limit || 10;
        const page = dto.page || 1;

        const mappedAlerts = await this.mapToRetentionAlertWithStudentProjections(rows);
        const totalPages = Math.ceil(count / limit);

        const paginatedResult: PaginatedResult<RetentionAlertWithStudentProjection> = {
            data: mappedAlerts,
            meta: {
                totalItems: count,
                itemCount: mappedAlerts.length,
                itemsPerPage: limit,
                totalPages: totalPages,
                currentPage: page,
            },
        };

        return paginatedResult;
    }

    public async updateAlertInfo(id: string, dto: UpdateRetentionAlertDto): Promise<RetentionAlertEntity> {
        const alert = await RetentionAlert.findByPk(id);

        if (!alert) {
            throw CustomError.notFound("Retention alert not found");
        }

        await alert.update({
            re_al_has_responded: dto.hasResponded,
            re_al_is_justified: dto.isJustified,
            re_al_observations: dto.observations,
            re_al_contact_date: dto.contactDate || alert.re_al_contact_date,
            re_al_justification_reason: dto.justificationReason || alert.re_al_justification_reason,
            re_al_return_deadline: dto.returnDeadline || alert.re_al_return_deadline,
            re_al_status: retentionAlertStatus.InProgress,
        });

        return this.mapToRetentionAlertEntity(alert);
    }

    public async changeAlertStatus(id: string, status: RetentionAlertStatus): Promise<RetentionAlertEntity> {
        const alert = await RetentionAlert.findByPk(id);

        if (!alert) {
            throw CustomError.notFound("Retention alert not found");
        }

        await alert.update({
            re_al_status: status,
            re_al_resolution_date:
                status === retentionAlertStatus.Resolved || status === retentionAlertStatus.Unresolved ? new Date() : null,
        });

        return this.mapToRetentionAlertEntity(alert);
    }

    private buildGetAlertsQueryOptions(dto: GetRetentionAlertsDto): FindOptions {
        const whereClause: WhereOptions = {};

        if (dto.status) {
            whereClause.re_al_status = dto.status;
        }
        if (dto.daysAbsent !== undefined) {
            whereClause.re_al_days_absent = { [Op.gte]: dto.daysAbsent };
        }
        if (dto.isJustified !== undefined) {
            whereClause.re_al_is_justified = dto.isJustified;
        }

        const studentWhereClause: WhereOptions = {
            ...(dto.studentParameter && {
                [Op.or]: [
                    { st_full_name: { [Op.iLike]: `%${dto.studentParameter}%` } },
                    { st_identification_card: { [Op.iLike]: `%${dto.studentParameter}%` } },
                    { st_phone_number: { [Op.iLike]: `%${dto.studentParameter}%` } },
                    { st_email: { [Op.iLike]: `%${dto.studentParameter}%` } },
                ],
            }),
            ...(dto.contractStatus && {
                st_contract_status: dto.contractStatus,
            }),
        };

        const limit = dto.limit || 10;
        const page = dto.page || 1;
        const offset = (page - 1) * limit;

        return {
            where: whereClause,
            include: [
                {
                    model: Student,
                    required: true,
                    where: dto.studentParameter || dto.contractStatus ? studentWhereClause : undefined,
                },
            ],
            limit,
            offset,
            order: [["re_al_created_at", "DESC"]],
        };
    }

    private async mapToRetentionAlertWithStudentProjections(alerts: RetentionAlert[]): Promise<RetentionAlertWithStudentProjection[]> {
        return alerts.map((alert) => {
            const rawObj = alert.toJSON();

            return RetentionAlertWithStudentMapper.create(rawObj);
        });
    }

    private async mapToRetentionAlertEntity(alert: RetentionAlert): Promise<RetentionAlertEntity> {
        return RetentionAlertMapper.create(alert.toJSON());
    }
}
