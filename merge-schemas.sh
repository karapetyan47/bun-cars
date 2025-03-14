#!/bin/bash

# Merge all .prisma files into one
cat src/prisma/schemas/*.prisma > src/prisma/schema.prisma

echo "Schemas merged successfully!"
