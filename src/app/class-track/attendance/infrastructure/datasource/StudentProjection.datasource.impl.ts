import Student from "@/data/models/AdminDesk/Student.model";
import StudentModule from "@/data/models/AdminDesk/StudentModule.model";
import { CustomError } from "@/core/error/customError.error";

import { Op } from "sequelize";
import type { StudentProjectionDatasource } from "@/app/class-track/attendance/domain/datasource/StudentProjection.datasource";
import type { ActiveStudentProjection } from "@/app/class-track/core/interfaces/StudentProjection.interface";
import { StudentProjectionMapper } from "@/app/class-track/attendance/infrastructure/mappers/StudentProjection.mapper";

export class StudentProjectionDatasourceImpl implements StudentProjectionDatasource {
    public async getActiveStudentProfile(studentId: string): Promise<ActiveStudentProjection> {
        try {
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
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer("Error retrieving active student profile");
        }
    }
}
