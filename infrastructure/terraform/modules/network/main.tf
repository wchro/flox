resource "aws_vpc" "this" {
    cidr_block = var.vpc_cidr
    tags = { Name = "${var.name}-vpc" }
}

resource "aws_subnet" "this" {
    vpc_id = aws_vpc.this.id
    cidr_block = var.subnet_cidr
    tags = merge(var.tags, { Name = "${var.name}-subnet" })
}

resource "aws_internet_gateway" "this" {
    vpc_id = aws_vpc.this.id
    tags = merge(var.tags, { Name = "${var.name}-igw" })
}

resource "aws_route_table" "this" {
    vpc_id = aws_vpc.this.id
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.this.id
    }
    tags = merge(var.tags, { Name = "${var.name}-rt" })
}

resource "aws_route_table_association" "this" {
    subnet_id = aws_subnet.this.id
    route_table_id = aws_route_table.this.id
}

resource "aws_security_group" "this" {
    name = "${var.name}"
    vpc_id = aws_vpc.this.id
    tags = merge(var.tags, { Name = "${var.name}-sg" })
}

resource "aws_vpc_security_group_ingress_rule" "http_in" {
    security_group_id = aws_security_group.this.id

    cidr_ipv4 = "0.0.0.0/0"
    from_port = 80
    ip_protocol = "tcp"
    to_port = 80
}

resource "aws_vpc_security_group_egress_rule" "all_out" {
    security_group_id = aws_security_group.this.id

    cidr_ipv4 = "0.0.0.0/0"
    ip_protocol = "-1"

}

output "vpc_id"     { value = aws_vpc.this.id }
output "subnet_id"  { value = aws_subnet.this.id }
output "sg_id"      { value = aws_security_group.this.id }