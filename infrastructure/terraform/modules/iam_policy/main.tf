resource "aws_iam_policy" "this" {
    name = var.name
    policy = var.document

    tags = var.tags
}

output "policy_arn" {
  value = aws_iam_policy.this.arn
}