variable "vpc_cidr" {
     type = string
     default = "10.0.0.0/16"
}

variable "subnet_cidr" {
    type = string
    default = "10.0.1.0/24"
}

variable "ami_id" { type = string }
variable "instance_size" {
    type = string
    default = "c7i-flex.large"
}

variable "environment" {
    type = string
    default = "dev"
}
