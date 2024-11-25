terraform {
  backend "s3" {
    bucket = "dmorgan-tfstate"
    key    = "terraform.tfstate"
    region = "us-east-1"
    
  }
}
provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "profilesite_bucket" {
  bucket = "profilesite-bucket"
}

resource "aws_s3_bucket_public_access_block" "profilesite_bucket_block" {
  bucket = aws_s3_bucket.profilesite_bucket.id

  block_public_acls   = true
  block_public_policy = true
  ignore_public_acls  = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "profilesite_bucket_versioning" {
  bucket = aws_s3_bucket.profilesite_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}


resource "aws_cloudfront_origin_access_control" "profilesite_oac" {
  name = "profilesite-oac"
  description = "Origin Access Control for profilesite bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

resource "aws_cloudfront_distribution" "profilesite_distribution" {
  origin {
    domain_name = aws_s3_bucket.profilesite_bucket.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.profilesite_bucket.bucket_regional_domain_name
    connection_attempts      = 3
    connection_timeout       = 10
    origin_access_control_id = aws_cloudfront_origin_access_control.profilesite_oac.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Profilesite CDN"
  price_class         = "PriceClass_100"


  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "profilesite-bucket.s3.us-east-1.amazonaws.com"
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress = true
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6" //Managed by AWS
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}