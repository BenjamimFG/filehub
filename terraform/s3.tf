# Document bucket creation
resource "aws_s3_bucket" "document_bucket"{
  bucket = var.document_bucket_name
  force_destroy = true
}