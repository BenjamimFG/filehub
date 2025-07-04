# # DB
resource "aws_db_instance" "default" {
  instance_class = var.db_instance_type
  engine               = "postgres"
  multi_az = false
  # TODO: Atualizar usuario e senha do db
  db_name = "filehub"
  username             = var.db_username
  password             = var.db_password
  publicly_accessible = true
  allocated_storage = 10
  skip_final_snapshot = true
}