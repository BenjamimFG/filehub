terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
}

# Bucket creation
resource "aws_s3_bucket" "s3_bucket"{
  bucket = "filehub-bucket-trabalho-unifor"

  tags = {
    "filehub": ""
  }
}

# DB
resource "aws_db_instance" "default" {
  instance_class = "db.t3.micro"
  engine               = "postgres"
  # TODO: Atualizar usuario e senha do db
  username             = "root"
  password             = "root1234"
  publicly_accessible = true
  allocated_storage = 10
  skip_final_snapshot = true

  tags = {
    "filehub": ""
  }
}

#   ami           = data.aws_ami.ubuntu.id
#   instance_type = "t2.micro"

#   tags = {
#     Name = "learn-terraform"
#   }
# }

# data "aws_ami" "ubuntu" {
#   most_recent = true

#   filter {
#     name = "name"
#     values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
#   }

#   owners = ["099720109477"] # Canonical
# }