variable "instance_type" {
 default = "t2.micro"
 description = "EC2 instance type"
}

variable "db_instance_type" {
  default = "db.t3.micro"
}

variable "document_bucket_name" {
  default = "filehub-document-bucket"
}

variable "db_username" {
  description = "Usuário do banco de dados"
}

variable "db_password" {
  description = "Senha do banco de dados"
}

