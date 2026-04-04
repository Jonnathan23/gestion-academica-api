import { User } from "@/data/models/Shared";
import type { UserSegurityDataSource } from "@/app/Shared/Identity/domain/datasource/userSegurity.datasource";

export class UserSegurityDataSourceImpl implements UserSegurityDataSource {
    async checkUserActiveStatus(id: string): Promise<boolean> {
        try {
            const user = await User.findByPk(id, {
                attributes: ['us_is_active']
            });

            if (!user) return false;

            return user.us_is_active;
        } catch (error) {
            throw error;
        }
    }
}