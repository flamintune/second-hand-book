#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <directory_path> <component_name>"
    exit 1
fi

# Get directory path and component name from command line arguments
COMPONENT_DIR="$1"
COMPONENT_NAME="$2"

# Create the directory if it doesn't exist
mkdir -p "$COMPONENT_DIR"

# Function to create a component file
create_component() {
    local name=$1
    local file_path="$COMPONENT_DIR/$name.tsx"
    
    echo "Creating $name component..."
    
    # Create the file and add content
    cat > "$file_path" << EOL
import React from 'react';

const $name: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">${name}</h1>
      {/* Add content for the ${name} component */}
    </div>
  );
};

export default $name;
EOL

    echo "$name component created at $file_path"
}

# Create the component
create_component "$COMPONENT_NAME"

echo "Component has been created successfully!"