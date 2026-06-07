import { Op } from "sequelize";

import Student from "@/data/models/admin-desk/Student.model";
import StudentModule from "@/data/models/admin-desk/StudentModule.model";
import { CustomError } from "@/core/error/customError.error";

import type { StudentProjectionDatasource } from "@/app/class-track/feats/attendance/domain/datasource/studentProjection.datasource";
import type { ActiveStudentProjection } from "@/app/class-track/core/interfaces/StudentProjection.interface";
import { StudentProjectionMapper } from "@/app/class-track/feats/attendance/infrastructure/mappers/studentProjection.mapper";

export class StudentProjectionDatasourceImpl implements StudentProjectionDatasource {
    public async getActiveStudentProfile(studentId: string): Promise<ActiveStudentProjection> {
        const student = await Student.findOne({
            where: { st_id: studentId },
            include: [
                {
                    model: StudentModule,
                    where: {
                        st_mod_status: {
                            [Op.in]: ["ACTIVE", "FROZEN"],
                        },
                    },
                    required: true,
                },
            ],
        });

        if (!student) {
            throw CustomError.notFound("Active student profile not found");
        }

        return StudentProjectionMapper.entityFromObject(student);
    }

    public async getActiveContractsCount(): Promise<number> {
        const count = await StudentModule.count({
            where: {
                st_mod_status: "ACTIVE",
            },
        });
        return count;
    }
}
