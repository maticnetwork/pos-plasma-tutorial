#Serve the app with NGINX
FROM nginx:alpine

# Copy the build files from the build folder to /usr/share/nginx/html
COPY build /usr/share/nginx/html

# Replace default nginx conf with custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the desired port (default is 80 for NGINX)
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
