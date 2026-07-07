import type { UserSegurityDataSource } from "@/app/shared/identity/domain/datasource/userSegurity.datasource";
import { User } from "@/data/models/shared";

export class UserSegurityDataSourceImpl implements UserSegurityDataSource {
    public async checkUserActiveStatus(id: string): Promise<boolean> {
        const user = await User.findByPk(id, {
            attributes: ["us_is_active"],
        });

        if (!user) return false;

        return user.us_is_active;
    }
}
