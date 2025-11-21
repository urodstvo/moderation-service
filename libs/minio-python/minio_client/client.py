import json
import logging

from minio import Minio
from minio.error import S3Error

from app_config import Config

class MinioClient:
    def __init__(self, config: Config, logger: logging.Logger):
        self.config = config
        self.logger = logger
        try: 
            self.client = Minio(
                config.S3Host,
                access_key=config.S3AccessToken,
                secret_key=config.S3SecretToken,
                secure=False,
                region=config.S3Region
            )

            try:
                found = self.client.bucket_exists(config.S3Bucket)
                if not found:
                    self.client.make_bucket(config.S3Bucket)
            except S3Error as e:
                self.logger.error(f"Cannot create or check bucket: {e}")
                raise

            policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"AWS": ["*"]},
                        "Action": ["s3:GetObject"],
                        "Resource": [f"arn:aws:s3:::{config.S3Bucket}/*"]
                    }
                ]
            }

            try:
                self.client.set_bucket_policy(config.S3Bucket, json.dumps(policy))
            except S3Error as e:
                self.logger.error(f"Cannot set bucket policy: {e}")
                raise

        except Exception as e:
            logger.error(f"Occurred error while connecting to minIO: {e}")
            raise

    def get_file(self, filename: str) -> bytes:
        try:
            response = self.client.get_object(self.config.S3Bucket, filename)
            try:
                return response.read()
            finally:
                response.release_conn()

        except Exception as e:
            self.logger.error(f"Occurred error while getting {filename} from minIO: {e}")
            raise

    def download_file(self, filename: str, download_path: str):
        try:
            self.client.fget_object(self.config.S3Bucket, filename, download_path)
        except S3Error as e:
            self.logger.error(f"Occurred error while downloading {filename} from minIO: {e}")
            raise

    def get_file_url(self, filename: str) -> str:
        try:
            url = self.client.presigned_get_object(self.config.S3Bucket, filename)
            return url
        except S3Error as e:
            self.logger.error(f"Occurred error while getting public url for {filename}: {e}")
            raise

