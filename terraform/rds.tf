# DB
resource "aws_db_instance" "filehub_db" {
  instance_class = var.db_instance_type
  engine               = "postgres"
  multi_az = false
  db_name = "filehub"
  username             = var.db_username
  password             = var.db_password
  publicly_accessible = true
  allocated_storage = 10
  skip_final_snapshot = true
}

output "db_url" {
  value = aws_db_instance.filehub_db.endpoint
}