import { CustomError } from "@/core/error/customError.error";
import { StudentClassTrackProjection } from "../../domain/projections/StudentClassTrack.projection";

export class StudentMapper {
    public static studentClassTrackProjectionFromObject(object: { [key: string]: any }): StudentClassTrackProjection {
        const { st_id, st_identification_card, st_full_name } = object;

        if (!st_id) {
            throw CustomError.internalServer("Missing st_id in student mapper");
        }
        if (!st_identification_card) {
            throw CustomError.internalServer("Missing st_identification_card in student mapper");
        }
        if (!st_full_name) {
            throw CustomError.internalServer("Missing st_full_name in student mapper");
        }

        return new StudentClassTrackProjection(st_id, st_identification_card, st_full_name);
    }
}
