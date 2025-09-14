provider "aws" {
    region = "eu-south-2"
    profile = "terraform"
}

locals {
    base_tags = {
         Owner   = "flox@orwi.dev"
         Team    = "floxers"
         Project = "flox"
    }
}

module "network" {
    source = "./modules/network"
    name = "flox"
    vpc_cidr = var.vpc_cidr
    subnet_cidr = var.subnet_cidr
    tags = local.base_tags
}

module "compute" {
    source = "./modules/compute"
    name = "flox"
    ami_id = var.ami_id
    instance_size = var.instance_size
    subnet_id = module.network.subnet_id
    sg_id = module.network.sg_id
    environment = var.environment
    tags = local.base_tags
}

module "s3_raw" {
    source = "./modules/storage"
    name = "flox-raw"
    tags = local.base_tags
}

module "s3_vod" {
    source = "./modules/storage"
    name = "flox-vod"
    tags = local.base_tags
}

module "mediaconvert_policy" {
    source = "./modules/iam_policy"
    name = "s3-raw-access"

    tags = local.base_tags
    
    
    document = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Effect = "Allow"
                Action = ["s3:GetObject", "s3:ListBucket"]
                Resource = [
                    module.s3_raw.bucket_arn,
                    "${module.s3_raw.bucket_arn}/*"
                ]
            },
            {
                Effect = "Allow"
                Action = ["s3:PutObject"]
                Resource = [
                module.s3_vod.bucket_arn,
                "${module.s3_vod.bucket_arn}/*"
                ]
            }
        ]
    })
}

module "mediaconvert_role" {
    source = "./modules/iam_role"
    name = "flox-mediaconvert"
    tags = local.base_tags

    principals = ["mediaconvert.amazonaws.com"]
    policy_arns = {
        s3_access = module.mediaconvert_policy.policy_arn
    }
}

module "video_cdn" {
    source = "./modules/cloudfront"
    name = "flox"
    bucket_name = module.s3_vod.bucket_name
    bucket_arn = module.s3_vod.bucket_arn
    bucket_domain = module.s3_vod.bucket_domain
}

output "instance_id" { value = module.compute.instance_id }
output "public_ip"   { value = module.compute.public_ip }
output "video_cdn_url" { value = module.video_cdn.cdn_url }
