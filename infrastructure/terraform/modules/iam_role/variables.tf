variable "name" { type = string }
variable "principals" { type = list(string) }
variable "policy_arns" { type = map(string) }
variable "tags" { type = map(string) }