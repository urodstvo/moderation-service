from src.auth.models import User, ShowUser, CreateUser


class UserManager:
    """Class for interacting with User Model"""

    @staticmethod
    async def createUser(data: CreateUser, db) -> ShowUser:
        async with db as session:
            async with session.begin():
                user = User(username=data.username, password=data.password, email=data.email)
                session.add(user)
                await session.flush()
                return ShowUser(
                    user_id=user.user_id,
                    username=user.username,
                    email=user.email,
                    is_verified=user.is_verified,
                    registered_at=user.registered_at
                )
