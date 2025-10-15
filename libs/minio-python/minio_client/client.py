import json
import logging

from minio import Minio
from minio.error import S3Error

from config import Config

class MinioClient:
    def __init__(self, config: Config, logger: logging.Logger):
        self.config = config
        self.logger = logger
        try: 
            self.client = Minio(
                config.CDNHost,
                access_key=config.CDNAccessToken,
                secret_key=config.CDNSecretToken,
                secure=False,
                region=config.CDNRegion
            )

            try:
                found = self.client.bucket_exists(config.CDNBucket)
                if not found:
                    self.client.make_bucket(config.CDNBucket)
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
                        "Resource": [f"arn:aws:s3:::{config.CDNBucket}/*"]
                    }
                ]
            }

            try:
                self.client.set_bucket_policy(config.CDNBucket, json.dumps(policy))
            except S3Error as e:
                self.logger.error(f"Cannot set bucket policy: {e}")
                raise

        except Exception as e:
            logger.error(f"Occurred error while connecting to minIO: {e}")
            raise

    def get_file(self, filename: str) -> bytes:
        try:
            response = self.client.get_object(self.config.CDNBucket, filename)
            try:
                return response.read()
            finally:
                response.release_conn()

        except Exception as e:
            self.logger.error(f"Occurred error while getting {filename} from minIO: {e}")
            raise

    def download_file(self, filename: str, download_path: str):
        try:
            self.client.fget_object(self.config.CDNBucket, filename, download_path)
        except S3Error as e:
            self.logger.error(f"Occurred error while downloading {filename} from minIO: {e}")
            raise

    def get_file_url(self, filename: str) -> str:
        try:
            url = self.client.presigned_get_object(self.config.CDNBucket, filename)
            return url
        except S3Error as e:
            self.logger.error(f"Occurred error while getting public url for {filename}: {e}")
            raise

