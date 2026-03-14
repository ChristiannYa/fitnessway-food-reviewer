import type { UserType } from "@/types/userTypes";
import { ShieldUser, User, UserStar } from "lucide-react";

export const getUserTypeIcon = (type: UserType) => {
	switch (type) {
		case "ADMIN":
			return ShieldUser;
		case "CONTRIBUTOR":
			return UserStar;
		case "USER":
			return User;
	}
};
