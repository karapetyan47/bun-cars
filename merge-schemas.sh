#!/bin/bash

# Merge all .prisma files into one
cat prisma/schemas/*.prisma > prisma/schema.prisma

echo "Schemas merged successfully!"
