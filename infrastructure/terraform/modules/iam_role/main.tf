resource "aws_iam_role" "this" {
    name = var.name
    tags = var.tags

    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = "sts:AssumeRole"
                Effect = "Allow"
                Principal = {
                    Service = var.principals
                }
            }
        ]
    })
}

resource "aws_iam_role_policy_attachment" "attachments" {
    for_each = var.policy_arns

    role = aws_iam_role.this.name
    policy_arn = each.value
}

output "role_arn" { value = aws_iam_role.this.arn}