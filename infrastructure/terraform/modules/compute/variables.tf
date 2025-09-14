variable "name"          { type = string }
variable "ami_id"        { type = string }
variable "instance_size" { type = string }
variable "subnet_id"     { type = string }
variable "sg_id"         { type = string }
variable "environment"   { type = string }
variable "tags"          { type = map(string) }