resource "aws_key_pair" "this" {
    key_name = "${var.name}-key"
    public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDRQc9XozwiNeMTpHgUQk+GvMDGehlPlR5u1/M8ILq9LAvaUEihKjK0Ju8v9e3Gp5YC3R9L/8KRG8B8vzhiuTTES6YLhnKoYk0a5nGkvDTT96gpK8vPT44InXthOn0bswkMK2Ckbbf8X5+3g+B4R/xAPujej89L2GwFmaivIjAW+IocfmIV1bC9eXmRjwsdPlj9wKSmMUWzVQgeLs+OsJwe9acu8mWhC0QRgSLLQ+VCg1x7xXIg7iaUb4hAiXC0zaUToUIqnuFHZQAYZyqYM7+ZOBIh2kf++ps+45TVz3sKgtJR3g7cH56IdE3qHwy0K0lqtJsX0Cqyw8JAmI3oQAPQXmVfUDhAmjfhNvej/pUwaBxfv2/D76D/gZRm8Vq832D+5f/49Z6+AtLqDf0+yMnq+XXNs3VNfKYhiYELDx0fob/IW+5icx595QFNr5mrSQVgoN/N2LmjFwB4io144qhXWkz6lPudCjgszYieA2qy9VEpyp/K5iBRV1aG0hajIk4V+5M+q5XPYo7gVkAWZ5VdHl6V5rHYmeRbaMaUr+O7XUGO8nXOvc9QfnUftl9rXGrQGYhgBlGNxl6945YHGCHceUEzju6Gz9vPPBGQUGAHf1zCpHq+8ShlInuTeDONAfXcHzKqS/34W+J4WOvZlwfI4x0pGBKOZhNzSYLsYN8ucQ== hyj@hyjs-MacBook-Pro.local"
    tags = merge(var.tags, { Name = "${var.name}-key"})
}

resource "aws_instance" "flox" {
    ami = var.ami_id
    instance_type = var.instance_size

    user_data = <<-CLOUD
    #cloud-config
    package_update: true

    runcmd:
        - apt-get update -y && apt-get install ca-certificates curl -y
        - install -m 0755 -d /etc/apt/keyrings
        - curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
        - chmod a+r /etc/apt/keyrings/docker.asc
        - sh -c 'echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) stable" > /etc/apt/sources.list.d/docker.list'
        - apt-get update -y && apt-get install git docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
        - git clone https://github.com/wchro/flox.git && cd flox && git checkout develop && mv infrastructure/docker/.env.common.example infrastructure/docker/.env.common && docker network create flox-net && docker compose -f infrastructure/docker/compose.base.yaml up -d && docker compose -f infrastructure/docker/compose.nginx.yaml up -d && docker compose -f infrastructure/docker/compose.base.yaml run --rm auth-service node scripts/db_setup.js

    CLOUD

    key_name = aws_key_pair.this.key_name

    subnet_id = var.subnet_id
    vpc_security_group_ids = [var.sg_id]
    associate_public_ip_address = true

    tags = merge(var.tags, {
        Name        = "${var.name}-web"
        Environment = var.environment
    })
}

output "instance_id" { value = aws_instance.flox.id }
output "public_ip"   { value = aws_instance.flox.public_ip}