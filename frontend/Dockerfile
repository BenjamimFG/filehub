# Use official Node.js image
FROM node:24-alpine

# Install 'serve' globally
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built static files (assumes `dist/` is already built)
COPY dist ./dist

# Expose the port serve will run on
EXPOSE 3000

# Run the app
CMD ["serve", "-s", "dist", "-l", "3000"]
