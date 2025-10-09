from qcloud_cos import CosConfig, CosS3Client
from qcloud_cos.cos_auth import CosRtmpAuth, CosS3Auth
from sts.sts import Sts

from config.settings.base import COS_SECRET_ID, COS_SECRET_KEY, COS_REGION, COS_BUCKET_NAME, TENCENT_STS_HOST


class CosHandler:

    secret_id = COS_SECRET_ID
    secret_key = COS_SECRET_KEY
    region = COS_REGION
    bucket_name = COS_BUCKET_NAME
    sts_host = TENCENT_STS_HOST

    @classmethod
    def get_presigned_url(cls, key, headers=None, method='PUT'):
        """
        生成上传预签名链接
        :param key:
        :param headers:
        :param method:
        :return:
        """
        # if not headers:
        #     headers = {
        #         'x-web': 'lab'  # 预签名 URL 本身是不包含请求头部的，但请求头部会算入签名，那么使用 URL 时就必须携带请求头部，并且请求头部的值必须是这里指定的值
        #     }
        config = CosConfig(
            Region=cls.region, SecretId=cls.secret_id, SecretKey=cls.secret_key
        )
        client = CosS3Client(config)
        return client.get_presigned_url(
            Method=method,
            Bucket=cls.bucket_name,
            Key=key,
            Headers=headers,
            Expired=3600  # 300秒后过期，过期时间请根据自身场景定义
        )

    @classmethod
    def get_tmp_auth(cls, key):
        config = CosConfig(
            Region=cls.region, SecretId=cls.secret_id, SecretKey=cls.secret_key
        )
        client = CosS3Client(config)
        return client.get_auth(
            Method='GET',
            Bucket=cls.bucket_name,
            Key=key,
            Expired=3600  # 300秒后过期，过期时间请根据自身场景定义
        )

    @classmethod
    def get_temp_credential(cls, prefix):
        """
        获取临时密钥
        :param prefix: 例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
        :return:
        """
        config = {
            # 请求URL，域名部分必须和domain保持一致
            # 使用外网域名时：https://sts.tencentcloudapi.com/
            # 使用内网域名时：https://sts.internal.tencentcloudapi.com/
            'url': f'https://{cls.sts_host}/',
            # 域名，非必须，默认为 sts.tencentcloudapi.com
            # 内网域名：sts.internal.tencentcloudapi.com
            'domain': cls.sts_host,
            # 临时密钥有效时长，单位是秒
            'duration_seconds': 1800,
            'secret_id': cls.secret_id,
            # 固定密钥
            'secret_key': cls.secret_key,
            # 设置网络代理
            # 'proxy': {
            #     'http': 'xx',
            #     'https': 'xx'
            # },
            # 换成你的 bucket
            'bucket': cls.bucket_name,
            # 换成 bucket 所在地区
            'region': cls.region,
            # 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径
            # 例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
            'allow_prefix': [prefix],
            # 密钥的权限列表。简单上传和分片需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/31923
            'allow_actions': [
                'name/cos:*',
                # 简单上传
                # 'name/cos:PutObject',
                # 'name/cos:PostObject',
                # # 分片上传
                # 'name/cos:InitiateMultipartUpload',
                # 'name/cos:ListMultipartUploads',
                # 'name/cos:ListParts',
                # 'name/cos:UploadPart',
                # 'name/cos:CompleteMultipartUpload',
                # "name/cos:GetObject"
            ],
            # 临时密钥生效条件，关于condition的详细设置规则和COS支持的condition类型可以参考 https://cloud.tencent.com/document/product/436/71306
            "condition": {}
        }

        try:
            sts = Sts(config)
            response = sts.get_credential()
            return dict(response)
        except Exception as e:
            print(e)


if __name__ == '__main__':
    print(CosHandler.get_temp_credential('11/*'))

