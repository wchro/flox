resource "aws_cloudfront_origin_access_control" "this" {
  name                              = "${var.name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "this" {
    enabled = true

    origin {
        domain_name = var.bucket_domain
        origin_id = "s3-${var.name}-origin"
        origin_access_control_id = aws_cloudfront_origin_access_control.this.id
    }

    default_cache_behavior {
        allowed_methods = ["GET", "HEAD"]
        cached_methods = ["GET", "HEAD"]
        target_origin_id = "s3-${var.name}-origin"
        viewer_protocol_policy = "redirect-to-https"

        forwarded_values {
          query_string = true

          cookies {
            forward = "none"
          }
        }
    }

    restrictions {
        geo_restriction {
          restriction_type = "none"
          locations = []
        }
    }

    viewer_certificate {
      cloudfront_default_certificate = true
    }
}

resource "aws_s3_bucket_policy" "allow_cloudfront" {
    bucket = var.bucket_name
    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Effect = "Allow",
                Principal = {
                    Service = "cloudfront.amazonaws.com"
                },
                Action = "s3:GetObject",
                Resource = "${var.bucket_arn}/*",
                Condition = {
                    StringEquals = {
                        "AWS:SourceArn" = aws_cloudfront_distribution.this.arn
                    }
                }
            }
        ]
    })
}

output "cdn_url" { value = aws_cloudfront_distribution.this.domain_name }